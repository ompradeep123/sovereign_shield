const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { users, threatLogs, accessLogs, services, exceptions } = require('../db/mockDb');
const govChain = require('../blockchain/hashChain');

router.use(verifyToken, verifyAdmin);

router.get('/radar', (req, res) => {
    const totalUsers = users.length;
    const recentThreats = threatLogs.slice(-20).reverse();
    const failedLogins = threatLogs.filter(t => t.message.includes('login')).length;
    res.json({
        totalUsers,
        failedLogins,
        systemThreatLevel: failedLogins > 10 ? 'HIGH' : 'LOW',
        recentThreats
    });
});

router.post('/simulate/failover', (req, res) => {
    process.env.USE_BACKUP_NODE = process.env.USE_BACKUP_NODE === 'true' ? 'false' : 'true';
    res.json({ message: 'Failover activated, shifted to Backup Node.' });
});

router.get('/chain/audit', (req, res) => {
    const isValid = govChain.verifyChain();
    res.json({ valid: isValid, chain: govChain.chain });
});

// New System Dashboard Stats
router.get('/stats', (req, res) => {
    res.json({
         totalUsers: users.length,
         activeServices: services.length,
         pendingExceptions: exceptions.filter(e => e.status !== 'Resolved').length,
         blockchainHeight: govChain.chain.length
    });
});

// Exceptions Queue
router.get('/exceptions', (req, res) => {
    // Join with user data
    const populated = exceptions.map(ex => {
        const user = users.find(u => u.id === ex.userId);
        return { ...ex, userNID: user?.nid || 'Unknown' };
    }).reverse();
    res.json(populated);
});

router.post('/exceptions/:id/resolve', (req, res) => {
    const ex = exceptions.find(e => e.id === req.params.id);
    if (!ex) return res.status(404).json({ message: 'Exception not found' });
    ex.status = 'Resolved';
    
    // Update underlying service status to approved and log to blockchain
    const service = services.find(s => s.id === ex.serviceId);
    if (service) {
         service.status = 'Approved';
         const block = govChain.addBlock({
             recordId: service.id,
             userNID: users.find(u => u.id === service.userId)?.nid || 'Unknown',
             service: service.type,
             status: 'Approved (Post-Review)'
         });
         service.blockHash = block.hash;
    }

    res.json({ message: 'Exception resolved and service approved.' });
});

// Citizen Records
router.get('/citizens', (req, res) => {
    const citizenData = users.filter(u => u.role !== 'admin').map(u => ({
         id: u.id,
         nid: u.nid,
         name: u.name,
         attributes: u.attributes,
         requestCount: services.filter(s => s.userId === u.id).length
    }));
    res.json(citizenData);
});

// Audit Logs
router.get('/audit-logs', (req, res) => {
    const populated = accessLogs.map(log => {
        const user = users.find(u => u.id === log.userId);
        return { ...log, userNID: user?.nid || 'SYS', userName: user?.name || 'SYSTEM' };
    }).reverse();
    res.json(populated);
});

module.exports = router;
