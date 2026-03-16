const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { verifyToken } = require('../middleware/authMiddleware');
const { generateZKP, verifyZKP } = require('../zkp/zkpSim');
const govChain = require('../blockchain/hashChain');
const { storeHashOnBlockchain, verifyHashOnBlockchain } = require('../blockchain/blockchainService');
const { services, users, accessLogs, exceptions, threatLogs } = require('../db/mockDb');
const supabase = require('../lib/supabaseClient');

router.use(verifyToken);

// Digital Identity Wallet: Request ZKP (Zero Knowledge Proof) properties
router.get('/wallet/zkp', (req, res) => {
  let user = users.find(u => u.id === req.user.id);
  if (!user) {
    // Map new Supabase users contextually for the hackathon ZKP demo
    user = {
        id: req.user.id,
        attributes: { age: 34, citizenship: 'Verified Native', incomeEligibility: 'Eligible Tier 1' }
    };
  }
  
  const proofs = [
    { property: 'Age Verified', proof: generateZKP('Age', user.attributes.age) },
    { property: 'Citizenship Verified', proof: generateZKP('Citizenship', user.attributes.citizenship) },
    { property: 'Income Eligibility', proof: generateZKP('Income', user.attributes.incomeEligibility) }
  ];

  accessLogs.push({ userId: user.id, timestamp: new Date().toISOString(), service: 'Identity Provider', reason: 'Generated Identity Proofs' });

  res.json({ proofs });
});

// ZKP Verification Demo Endpoint
router.post('/verify-proof', (req, res) => {
    const { proof } = req.body;
    const isValid = verifyZKP(proof);
    
    if (isValid) {
      res.json({ status: 'Verification Successful', ...proof });
    } else {
      res.status(400).json({ status: 'Verification Failed' });
    }
});

// Request Gov Service
router.post('/request', async (req, res) => {
    try {
        const { serviceType, simulateAnomaly } = req.body;
        
        if (simulateAnomaly) {
            // Write to mock DB for backward compat with admin anomaly queue
            const newService = {
                id: crypto.randomUUID(),
                userId: req.user.id,
                type: serviceType,
                status: 'Exception Pending',
                timestamp: new Date().toISOString()
            };
            services.push(newService);
            exceptions.push({
                id: crypto.randomUUID(),
                serviceId: newService.id,
                userId: req.user.id,
                type: serviceType,
                reason: 'ZKP Signature Mismatch detected at API Gateway',
                timestamp: new Date().toISOString(),
                status: 'Pending Admin Review'
            });
            threatLogs && threatLogs.push({
                 timestamp: new Date().toISOString(),
                 severity: 'MEDIUM',
                 message: 'Anomaly detected during service request: ZKP Mismatch',
                 path: '/api/services/request',
                 ip: req.ip || 'INTERNAL'
            });
            
            // Also write threat to Supabase
            await supabase.from('threat_logs').insert({
                 event_type: 'Anomaly detected: ZKP Mismatch',
                 severity: 'MEDIUM',
                 ip_address: req.ip || 'INTERNAL'
            }).catch(() => {});
            
            return res.status(202).json({ message: 'Request flagged due to anomaly. Forwarded to Admin Exception Queue.', service: newService });
        }
        
        // Write to Supabase definitively
        const { data: newService, error } = await supabase
            .from('service_requests')
            .insert({
                citizen_id: req.user.id,
                service_type: serviceType,
                status: 'Approved'
            }).select().single();
            
        if (error) throw error;
        
        // Write Audit Log
        const dataTag = serviceType === 'Subsidy Application' ? '[DATA_ACCESSED: Financial Records, Family Size]' : '[DATA_ACCESSED: Basic Identity Metrics]';
        await supabase.from('audit_logs').insert({
            action: `${dataTag} Approved Government Service Request: ${serviceType}`,
            user_id: req.user.id
        }).catch(() => {});
        
        res.json(newService);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get list of my requested services
router.get('/my-services', async (req, res) => {
    try {
        const citizenId = req.user.id;
        // Merge Supabase services and mock services for demo purposes
        const { data: dbServices, error } = await supabase.from('service_requests').select('*').eq('citizen_id', req.user.id);
        const { data: dbCerts, err2 } = await supabase.from('certificates').select('*').eq('citizen_id', req.user.id);
        
        let all = [...(dbServices || []), ...(dbCerts || [])];
        res.json(all);
    } catch (e) {
        // Mock fallback wrapper
        const uServices = services.filter(s => s.userId === req.user.id);
        res.json(uServices);
    }
});

// Verify Blockchain Certificate
router.get('/verify-cert/:id', (req, res) => {
    const recordId = req.params.id;
    const result = govChain.verifyRecord(recordId);
    
    if (result.valid) {
        res.json({ message: "Certificate Integrity Verified ✔", block: result.block });
    } else {
        res.status(400).json({ message: "Integrity Violation Detected ❌" });
    }
});

// Risk Score Calculation Helper
const calculateRiskScore = async (req, citizenId) => {
    let score = 0;
    
    // 1. Check Device Trust
    const fingerprint = req.header('X-Device-Fingerprint');
    if (fingerprint) {
        const { data: trusted } = await supabase.from('trusted_devices').select('*').eq('citizen_id', citizenId).eq('device_fingerprint', fingerprint).single();
        if (!trusted) score += 40; // High risk for unknown device
    } else {
        score += 20; // Moderate risk for missing fingerprint
    }

    // 2. Check recent failed attempts (Simulated logic or from threat_logs)
    const { count: failedLogins } = await supabase.from('threat_logs')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'Failed Login')
        .gt('timestamp', new Date(Date.now() - 3600000).toISOString()); // Last 1 hour
    
    if (failedLogins > 3) score += 30;

    return Math.min(100, score);
};

// Get Citizen Profile
router.get('/profile', async (req, res) => {
    try {
        const { data: citizen } = await supabase.from('citizens').select('*').eq('id', req.user.id).single();
        const { count: biometricCount } = await supabase.from('biometric_profiles').select('*', { count: 'exact', head: true }).eq('citizen_id', req.user.id);
        
        // Merge Supabase Auth metadata with DB profile
        res.json({
            ...citizen,
            name: req.user.name || citizen?.name || 'Sovereign Citizen',
            email: req.user.email || citizen?.email,
            nid: req.user.nid || citizen?.nid || 'NID-PENDING',
            hasBiometric: biometricCount > 0,
            securityLevel: biometricCount > 0 ? 'LEVEL_5_CLEARANCE' : 'LEVEL_2_STANDARD',
            created_at: citizen?.created_at || req.user.created_at || new Date().toISOString()
        });
    } catch (error) {
        // Fallback for demo if single() fails
        res.json({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name || 'Sovereign Citizen',
            nid: req.user.nid || 'NID-PENDING',
            hasBiometric: false,
            securityLevel: 'LEVEL_1_GUEST',
            created_at: new Date().toISOString()
        });
    }
});

// Register Biometric Template
router.post('/biometric/register', async (req, res) => {
    try {
        const { faceEmbedding } = req.body;
        if (!faceEmbedding) throw new Error('Missing biometric data');
        
        // In production: Encrypt faceEmbedding with a vault key
        const encryptedEmbedding = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret').update(faceEmbedding).digest('hex');

        await supabase.from('biometric_profiles').upsert({
            citizen_id: req.user.id,
            face_embedding: encryptedEmbedding
        });

        await supabase.from('audit_logs').insert({
            action: '[BIOMETRIC_ENROLLED] Facial biometric template registered and encrypted.',
            user_id: req.user.id
        });

        res.json({ status: 'SUCCESS' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verify Biometric
router.post('/biometric/verify', async (req, res) => {
    try {
        const { faceEmbedding } = req.body;
        
        const { data: profile } = await supabase.from('biometric_profiles').select('face_embedding').eq('citizen_id', req.user.id).single();
        
        if (!profile) return res.status(404).json({ verified: false, message: 'No biometric profile found' });

        const incomingHash = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret').update(faceEmbedding).digest('hex');
        const isMatch = incomingHash === profile.face_embedding;

        if (isMatch) {
            await supabase.from('audit_logs').insert({
                action: '[BIOMETRIC_VERIFIED] Step-up authentication successful via Facial ID.',
                user_id: req.user.id
            });
            res.json({ verified: true });
        } else {
            res.status(401).json({ verified: false, message: 'Biometric mismatch' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register Device Trust
router.post('/device/register', async (req, res) => {
    try {
        const fingerprint = req.header('X-Device-Fingerprint');
        if (!fingerprint) throw new Error('No fingerprint provided');
        await supabase.from('trusted_devices').upsert({
            citizen_id: req.user.id,
            device_fingerprint: fingerprint,
            metadata: {
                userAgent: req.header('User-Agent'),
                ip: req.ip
            }
        });

        await supabase.from('audit_logs').insert({
            action: `[DEVICE_TRUSTED] New device ${fingerprint.substring(0,8)}... registered.`,
            user_id: req.user.id
        });

        res.json({ status: 'SUCCESS' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Trust timeline
router.get('/timeline', async (req, res) => {
    try {
        const { data, error } = await supabase.from('audit_logs').select('*').eq('user_id', req.user.id).order('timestamp', { ascending: false });
        if (data && data.length > 0) return res.json(data);
    } catch (e) {}
    
    const uTimeline = accessLogs.filter(a => a.userId === req.user.id).reverse();
    res.json(uTimeline);
});

// 1. BIRTH CERTIFICATE SERVICE MODULE
router.post('/birth-certificate/request', async (req, res) => {
    try {
        const { childName, dob, pob, hospitalName, hospitalRecordId, parentName, parentNid, address, biometricVerified } = req.body;
        const citizenId = req.user.id;

        // Zero-Trust Enforcement: Biometric Check
        if (!biometricVerified) {
            return res.status(403).json({ error: 'Security Violation: Step-up Biometric Authentication required for this sensitive action.' });
        }

        // Zero-Trust Enforcement: Risk Score Check
        const riskScore = await calculateRiskScore(req, citizenId);
        if (riskScore > 70) {
            return res.status(403).json({ error: `Security Intercept: High Risk Score (${riskScore}) detected for this device/session. Access Denied.` });
        }

        // Step 1: Input Validation
        if (!childName || !dob || !pob || !hospitalRecordId) {
            return res.status(400).json({ error: 'Missing mandatory fields for registration' });
        }

        // Step 2: Service Request Persistence (Status: Under Verification)
        const { data: request, error: reqErr } = await supabase
            .from('service_requests')
            .insert({
                citizen_id: citizenId,
                service_type: 'Birth Certificate',
                status: 'Under Verification'
            }).select().single();

        if (reqErr) throw reqErr;

        // Step 3: Simulate Hospital Record & Jurisdiction Verification
        // In a real system, this would call Hospital API and Municipality API
        const isHospitalRecordValid = hospitalRecordId.startsWith('HOSP-');
        const isJurisdictionValid = address && address.length > 10;

        if (!isHospitalRecordValid || !isJurisdictionValid) {
            await supabase.from('service_requests').update({ status: 'Rejected' }).eq('id', request.id);
            return res.status(422).json({ 
                status: 'Rejected', 
                reason: 'Hospital Record ID could not be corroborated with National Health Stack.' 
            });
        }

        // Step 4: Processing (Simulated Delay/Logic)
        await supabase.from('service_requests').update({ status: 'Processing' }).eq('id', request.id);

        // Step 5: Certificate Generation
        const certMetadata = {
            certificateId: request.id,
            childName,
            dob,
            pob,
            parentName,
            issuingAuthority: 'Ministry of Civil Registry',
            timestamp: new Date().toISOString()
        };
        const dataHash = crypto.createHash('sha256').update(JSON.stringify(certMetadata)).digest('hex');

        // Step 6: Blockchain Anchoring
        const txHash = await storeHashOnBlockchain(request.id, dataHash);

        // Step 7: Finalize
        await supabase.from('certificates').insert({
            certificate_id: request.id,
            citizen_id: citizenId,
            service_type: 'Birth Certificate',
            data_hash: dataHash
        });

        await supabase.from('service_requests').update({ status: 'Completed' }).eq('id', request.id);

        // Step 8: Audit Log
        await supabase.from('audit_logs').insert({
            action: `[DATA_ACCESSED: Hospital Record ID, Parent National ID, Domicile Details] [BIRTH_CERT_ISSUED] Verified hospital record ${hospitalRecordId} and issued digital certificate anchored to Polygon. TX: ${txHash}`,
            user_id: citizenId
        });

        res.json({ status: 'SUCCESS', recordId: request.id, txHash });

    } catch (error) {
        console.error('Birth Cert Error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/birth-certificate/status/:id', async (req, res) => {
    try {
        const { data: request } = await supabase.from('service_requests').select('*').eq('id', req.params.id).single();
        res.json(request);
    } catch (e) {
        res.status(404).json({ error: 'Request not found' });
    }
});

// 2. TAX FILING SERVICE MODULE
router.post('/tax-filing/request', async (req, res) => {
    try {
        const { taxpayerId, financialYear, income, deductions, taxPaid, biometricVerified } = req.body;
        const citizenId = req.user.id;

        // Zero-Trust Enforcement: Biometric Check
        if (!biometricVerified) {
            return res.status(403).json({ error: 'Security Violation: Step-up Biometric Authentication required for sensitive financial filing.' });
        }

        // Zero-Trust Enforcement: Risk Score Check
        const riskScore = await calculateRiskScore(req, citizenId);
        if (riskScore > 70) {
            return res.status(403).json({ error: `Security Intercept: High Risk Score (${riskScore}) detected. Manual verification required.` });
        }

        // Step 1: Identity & Taxpayer Verification
        if (!taxpayerId || !financialYear) {
            return res.status(400).json({ error: 'Taxpayer ID and Financial Year required' });
        }

        const { data: request, error: reqErr } = await supabase
            .from('service_requests')
            .insert({
                citizen_id: citizenId,
                service_type: 'Tax Filing',
                status: 'Under Verification'
            }).select().single();

        if (reqErr) throw reqErr;

        // Step 2: Tax Calculation Logic
        const taxableIncome = Math.max(0, income - deductions);
        let taxLiability = 0;
        if (taxableIncome > 500000) taxLiability = (taxableIncome - 500000) * 0.2 + 12500;
        else if (taxableIncome > 250000) taxLiability = (taxableIncome - 250000) * 0.05;

        const balance = taxLiability - taxPaid;

        // Step 3: Persistence
        const receiptMetadata = {
            filingId: request.id,
            citizenId,
            taxpayerId,
            financialYear,
            income,
            taxLiability,
            status: balance <= 0 ? 'CLEARED' : 'PENDING_PAYMENT',
            timestamp: new Date().toISOString()
        };
        const dataHash = crypto.createHash('sha256').update(JSON.stringify(receiptMetadata)).digest('hex');

        // Step 4: Blockchain Record
        const txHash = await storeHashOnBlockchain(request.id, dataHash);

        // Step 5: Save Receipt as Certificate
        await supabase.from('certificates').insert({
            certificate_id: request.id,
            citizen_id: citizenId,
            service_type: 'Tax Filing Receipt',
            data_hash: dataHash
        });

        await supabase.from('service_requests').update({ 
            status: 'Completed',
            // Storing some metadata in status or request_data would be ideal if we had the column
        }).eq('id', request.id);

        // Step 6: Audit Log
        await supabase.from('audit_logs').insert({
            action: `[DATA_ACCESSED: Income Details, PAN Database, Tax Deductions] [TAX_FILED] Financial Year ${financialYear} processed. Liability: ${taxLiability}. Receipt anchored to Polygon. TX: ${txHash}`,
            user_id: citizenId
        });

        res.json({ 
            status: 'SUCCESS', 
            recordId: request.id, 
            taxLiability, 
            balance,
            txHash 
        });

    } catch (error) {
        console.error('Tax Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. ENHANCED CERTIFICATE VERIFICATION
router.post('/verify-certificate', async (req, res) => {
    try {
        const { certificateId } = req.body;

        // 1. Retrieve from DB
        const { data: cert, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('certificate_id', certificateId)
            .single();

        if (!cert) return res.status(404).json({ valid: false, message: 'Registry Error: Certificate ID not found.' });

        // 2. Recompute Hash Verification (In a real system we'd re-hash the data if we had it stored)
        // Here we verify the stored hash against the Blockchain record
        const isBlockchainValid = await verifyHashOnBlockchain(certificateId, cert.data_hash);

        // 3. Log verification audit
        await supabase.from('audit_logs').insert({
            action: `[CERT_VERIFIED] Integrity check performed on ${cert.service_type} (${certificateId}). Result: ${isBlockchainValid ? 'VALID' : 'TAMPERED'}`,
            user_id: req.user.id
        });

        if (isBlockchainValid) {
            res.json({
                valid: true,
                message: 'Certificate Integrity Verified',
                serviceType: cert.service_type,
                timestamp: cert.created_at,
                ledger: 'Polygon Proof-of-Stake',
                certificate: cert
            });
        } else {
            res.json({
                valid: false,
                message: 'Security Violation: Blockchain hash mismatch. This certificate has been tampered with.',
                ledger: 'Polygon Proof-of-Stake'
            });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Trust timeline (Already exists but ensure it pulls everything)
router.get('/timeline', async (req, res) => {
    try {
        const supabase = require('../lib/supabaseClient');
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*')
            .eq('user_id', req.user.id)
            .order('timestamp', { ascending: false });
            
        res.json(data || []);
    } catch (e) {
        res.json([]);
    }
});

// Log Audit Event (Citizen-facing)
router.post('/audit-logs/record', async (req, res) => {
    try {
        const { action } = req.body;
        
        await supabase.from('audit_logs').insert({
            action,
            user_id: req.user.id
        });
        
        res.json({ status: 'SUCCESS' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
