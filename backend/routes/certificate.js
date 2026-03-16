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

module.exports = router;
