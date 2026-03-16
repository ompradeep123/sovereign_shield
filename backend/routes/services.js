const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { verifyToken } = require('../middleware/authMiddleware');
const { generateZKP, verifyZKP } = require('../zkp/zkpSim');
const govChain = require('../blockchain/hashChain');
const { services, users, accessLogs, exceptions, threatLogs } = require('../db/mockDb');

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
        const supabase = require('../lib/supabaseClient');
        
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

// Get User Services
router.get('/my-services', async (req, res) => {
    try {
        const supabase = require('../lib/supabaseClient');
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

// Trust timeline
router.get('/timeline', async (req, res) => {
    try {
        const supabase = require('../lib/supabaseClient');
        const { data, error } = await supabase.from('audit_logs').select('*').eq('user_id', req.user.id).order('timestamp', { ascending: false });
        if (data && data.length > 0) return res.json(data);
    } catch (e) {}
    
    const uTimeline = accessLogs.filter(a => a.userId === req.user.id).reverse();
    res.json(uTimeline);
});

module.exports = router;
