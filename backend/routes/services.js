const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { verifyToken } = require('../middleware/authMiddleware');
const { generateZKP, verifyZKP } = require('../zkp/zkpSim');
const govChain = require('../blockchain/hashChain');
const { services, users, accessLogs, exceptions } = require('../db/mockDb');

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
router.post('/request', (req, res) => {
    const { serviceType, simulateAnomaly } = req.body;
    
    const newService = {
        id: crypto.randomUUID(),
        userId: req.user.id,
        type: serviceType,
        status: simulateAnomaly ? 'Exception Pending' : 'Approved',
        timestamp: new Date().toISOString()
    };
    
    services.push(newService);

    if (simulateAnomaly) {
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
        accessLogs.push({ userId: req.user.id, timestamp: new Date().toISOString(), service: serviceType, reason: 'Service Request flagged for Manual Review' });
        return res.status(202).json({ message: 'Request flagged due to anomaly. Forwarded to Admin Exception Queue.', service: newService });
    }
    
    // Create immutable block for approved request
    const blockData = {
        recordId: newService.id,
        userNID: req.user.nid,
        service: serviceType,
        status: 'Approved'
    };
    
    const block = govChain.addBlock(blockData);
    newService.blockHash = block.hash;
    
    accessLogs.push({ userId: req.user.id, timestamp: new Date().toISOString(), service: serviceType, reason: 'Approved Government Service Request' });

    res.json(newService);
});

// Get User Services
router.get('/my-services', (req, res) => {
    const uServices = services.filter(s => s.userId === req.user.id);
    res.json(uServices);
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
router.get('/timeline', (req, res) => {
    const uTimeline = accessLogs.filter(a => a.userId === req.user.id).reverse();
    res.json(uTimeline);
});

module.exports = router;
