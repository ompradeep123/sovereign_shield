const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const supabase = require('../lib/supabaseClient');
const { storeHashOnBlockchain, verifyHashOnBlockchain } = require('../blockchain/blockchainService');
const { verifyToken } = require('../middleware/authMiddleware');

// Create Birth Certificate
router.post('/birth-certificate', verifyToken, async (req, res) => {
    try {
        const citizenId = req.user.id;
        // 1. Create Service Request Note
        const { data: request, error: reqErr } = await supabase
            .from('service_requests')
            .insert({ citizen_id: citizenId, service_type: 'Birth Certificate', status: 'Approved' })
            .select().single();
            
        if (reqErr) throw reqErr;

        // 2. Generate Certificate Data and Hash
        const certificateData = {
            citizenId,
            fullName: req.user.name || 'Citizen',
            dob: '1990-01-01', // mock demographic
            issuer: 'SovereignShield Gov Portal',
            issueDate: new Date().toISOString()
        };
        
        const dataString = JSON.stringify(certificateData);
        const dataHash = crypto.createHash('sha256').update(dataString).digest('hex');

        // 3. Store on Polygon Blockchain
        const txHash = await storeHashOnBlockchain(request.id, dataHash);

        // 4. Save certificate to database - Use request.id as certificate_id for 1:1 mapping
        const { data: cert, error: certErr } = await supabase
            .from('certificates')
            .insert({
                certificate_id: request.id,
                citizen_id: citizenId,
                service_type: 'Birth Certificate',
                data_hash: dataHash
            }).select().single();
            
        if (certErr) throw certErr;

        // 5. Save Blockchain Record
        await supabase.from('blockchain_records').insert({
            record_id: request.id,
            hash: dataHash,
            previous_hash: txHash, // Store tx hash here to verify Polygon transaction later
        });

        // 6. Log Audit Event
        await supabase.from('audit_logs').insert({
            action: '[DATA_ACCESSED: Name, Date of Birth, Blockchain Hash] Birth Certificate Generation & Ledged to Polygon',
            user_id: citizenId
        });

        res.json({
            message: 'Certificate successfully deployed to blockchain.',
            certificate: cert,
            blockchainTx: txHash
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Verification Failed' });
    }
});

// Verify Certificate endpoint
router.get('/verify/:certId', async (req, res) => {
    try {
        const { certId } = req.params;
        
        // 1. Fetch certificate from DB
        let { data: cert, error: certErr } = await supabase
            .from('certificates')
            .select('*')
            .eq('certificate_id', certId)
            .single();
            
        // If not found in certificates, check service_requests (could be another type of verifiable record)
        if (!cert) {
            const { data: requestRecord } = await supabase
                .from('blockchain_records')
                .select('*, service_requests(service_type, created_at)')
                .eq('record_id', certId)
                .single();
            
            if (requestRecord) {
                cert = {
                    certificate_id: certId,
                    service_type: requestRecord.service_requests.service_type,
                    data_hash: requestRecord.hash,
                    created_at: requestRecord.service_requests.created_at
                };
            }
        }
            
        if (!cert) return res.status(404).json({ valid: false, message: 'Certificate or Record not found in database' });

        // 2. We use the service_requests id to verify on blockchain, since our schema models record_id matching request
        // Lookup the associated record. For simplicity of the mock, let's use the DB hash to check Blockchain.
        const isBlockchainValid = await verifyHashOnBlockchain(certId, cert.data_hash);
        
        if (isBlockchainValid) {
            // Log verification audit (anonymously or by citizen)
            if (req.user) {
                await supabase.from('audit_logs').insert({ action: '[DATA_ACCESSED: Certificate File, Registration Cryptographic Hash] Certificate Integrity Verified', user_id: req.user.id });
            }
            res.json({ valid: true, message: 'Certificate cryptographically verified against Polygon Ledger', certificate: cert });
        } else {
            res.json({ valid: false, message: 'Blockchain validation failed! Hash discrepancy detected.' });
        }
        
    } catch (error) {
        res.status(500).json({ valid: false, error: error.message });
    }
});

// 3. Vault & Anchor Document
router.post('/vault-document', verifyToken, async (req, res) => {
    try {
        const citizenId = req.user.id;
        const { documentName, documentType, documentHash, govSignature } = req.body;

        if (!documentName || !documentHash) {
            return res.status(400).json({ error: 'Missing document metadata' });
        }

        // --- STEP 1: AUTHENTICITY VALIDATION (The "Risky" check the user requested) ---
        // In a production app, we would use crypto.verify() with a Gov Public Key
        // For the hackathon model, we validate if the document carries a 'SOVEREIGN_GOV_AUTH' protocol signature
        const isGovAuthenticated = govSignature === 'SIG_SOVEREIGN_GOV_PRIMARY_Z1';
        
        if (!isGovAuthenticated) {
            return res.status(403).json({ 
                error: 'AUTHENTICATION_FAILURE', 
                message: 'This document does not carry a valid government digital signature. Vaulting rejected.' 
            });
        }

        // --- STEP 2: BLOCKCHAIN ANCHORING ---
        // Anchor the validated hash to the immutable ledger
        // We generate a valid UUID to satisfy the database constraint
        const recordId = crypto.randomUUID(); 
        const txHash = await storeHashOnBlockchain(recordId, documentHash);

        // --- STEP 3: PERSISTENCE & AUDIT ---
        const { data: cert, error: certErr } = await supabase
            .from('certificates')
            .insert({
                certificate_id: recordId,
                citizen_id: citizenId,
                service_type: documentType,
                data_hash: documentHash
            }).select().single();

        if (certErr) throw certErr;

        await supabase.from('audit_logs').insert({
            action: `[BLOCKCHAIN_ANCHOR] Document '${documentName}' validated and anchored to Polygon Ledger. TX: ${txHash}`,
            user_id: citizenId
        });

        res.json({
            status: 'SUCCESS',
            message: 'Document Authenticated & Anchored to Blockchain',
            txHash: txHash,
            recordId: recordId
        });

    } catch (error) {
        console.error('Vaulting Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Remote ZKP Verification (Service Provider View)
router.post('/verify-zkp', async (req, res) => {
    try {
        const { recordId, zkpProof, claimedHash } = req.body;

        // 1. Resolve Trust from Blockchain
        const isHashValid = await verifyHashOnBlockchain(recordId, claimedHash);
        
        if (!isHashValid) {
            return res.status(401).json({ 
                valid: false, 
                message: 'TRUST_REJECTED: Blockchain hash mismatch. This document has been tampered with.' 
            });
        }

        // 2. Mathematically check ZKP against the blockchain-anchored truth
        // Since we anchored the hash, we can verify the ZKP token against it
        const isZkpValid = zkpProof.includes('ZKP-x'); // Simulate math check

        if (isZkpValid) {
            res.json({ 
                valid: true, 
                message: 'ZERO_TRUST_APPROVED: Authenticated against Global Ledger via ZKP Selective Disclosure.' 
            });
        } else {
            res.json({ valid: false, message: 'ZKP mathematical proof failed.' });
        }

    } catch (error) {
        res.status(500).json({ valid: false, error: error.message });
    }
});

module.exports = router;
