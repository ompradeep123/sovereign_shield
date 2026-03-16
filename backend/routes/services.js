const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { verifyToken } = require('../middleware/authMiddleware');
const { generateZKP, verifyZKP } = require('../zkp/zkpSim');
const govChain = require('../blockchain/hashChain');
const { services, users, accessLogs } = require('../db/mockDb');

router.use(verifyToken);

// Digital Identity Wallet: Request ZKP (Zero Knowledge Proof) properties
router.get('/wallet/zkp', (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
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
    const { serviceType } = req.body;
    
    // Simulate auto-approval & Blockchain entry
    const newService = {
        id: crypto.randomUUID(),
        userId: req.user.id,
        type: serviceType,
        status: 'Approved',
        timestamp: new Date().toISOString()
    };
    
    services.push(newService);
    
    // Create immutable block
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
