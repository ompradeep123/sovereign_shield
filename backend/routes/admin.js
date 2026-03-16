const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { users, threatLogs, accessLogs, services } = require('../db/mockDb');
const govChain = require('../blockchain/hashChain');

router.use(verifyToken, verifyAdmin);

router.get('/radar', (req, res) => {
    const totalUsers = users.length;
    const recentThreats = threatLogs.slice(-20).reverse();
    
    // Fake some metrics
    const failedLogins = threatLogs.filter(t => t.message.includes('login')).length;
    
    res.json({
        totalUsers,
        failedLogins,
        systemThreatLevel: failedLogins > 10 ? 'HIGH' : 'LOW',
        recentThreats
    });
});

router.post('/simulate/failover', (req, res) => {
    // Toggles the backup node environment simulation
    process.env.USE_BACKUP_NODE = process.env.USE_BACKUP_NODE === 'true' ? 'false' : 'true';
    res.json({ message: 'Failover activated, shifted to Backup Node.' });
});

router.get('/chain/audit', (req, res) => {
    const isValid = govChain.verifyChain();
    res.json({ valid: isValid, chain: govChain.chain });
});

module.exports = router;
