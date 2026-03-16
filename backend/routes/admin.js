const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const { users, threatLogs, accessLogs, services, exceptions } = require('../db/mockDb');
const govChain = require('../blockchain/hashChain');

router.use(verifyToken, verifyAdmin);

router.get('/radar', async (req, res) => {
    try {
        const supabase = require('../lib/supabaseClient');
        
        // Fetch real data
        const { data: dbThreats } = await supabase.from('threat_logs').select('*').order('timestamp', { ascending: false }).limit(20);
        const { count: userCount } = await supabase.from('citizens').select('*', { count: 'exact', head: true });
        
        const recentThreats = dbThreats?.length > 0 ? dbThreats : threatLogs.slice(-20).reverse();
        const totalUsers = userCount || users.length;
        
        const failedLogins = recentThreats.filter(t => t.event_type?.includes('login') || t.message?.includes('login')).length;
        
        res.json({
            totalUsers,
            failedLogins,
            systemThreatLevel: failedLogins > 10 ? 'HIGH' : 'LOW',
            recentThreats: recentThreats.map(t => ({
                severity: t.severity || 'MEDIUM',
                timestamp: t.timestamp || t.created_at,
                ip: t.ip_address || t.ip || 'UNKNOWN',
                message: t.event_type || t.message,
                path: t.path || 'System'
            }))
        });
    } catch (e) {
        // Fallback
        const totalUsers = users.length;
        const recentThreats = threatLogs.slice(-20).reverse();
        const failedLogins = threatLogs.filter(t => t.message.includes('login')).length;
        res.json({
            totalUsers,
            failedLogins,
            systemThreatLevel: failedLogins > 10 ? 'HIGH' : 'LOW',
            recentThreats
        });
    }
});

router.post('/simulate/failover', (req, res) => {
    process.env.USE_BACKUP_NODE = process.env.USE_BACKUP_NODE === 'true' ? 'false' : 'true';
    res.json({ message: 'Failover activated, shifted to Backup Node.' });
});

router.get('/chain/audit', (req, res) => {
    const isValid = govChain.verifyChain();
    res.json({ valid: isValid, chain: govChain.chain });
});

// New System Dashboard Stats - Monitoring Cloud Infrastructure Metrics
router.get('/stats', async (req, res) => {
    try {
        const supabase = require('../lib/supabaseClient');
        const [{ count: uc }, { count: sc }, { count: bc }] = await Promise.all([
            supabase.from('citizens').select('*', { count: 'exact', head: true }),
            supabase.from('service_requests').select('*', { count: 'exact', head: true }),
            supabase.from('blockchain_records').select('*', { count: 'exact', head: true })
        ]);

        res.json({
            totalUsers: uc || users.length,
            activeServices: sc || services.length,
            pendingExceptions: sc > 0 ? 0 : exceptions.filter(e => e.status !== 'Resolved').length, // Simulating clean state on DB
            blockchainHeight: bc || govChain.chain.length
        });
    } catch (e) {
        res.json({
            totalUsers: users.length,
            activeServices: services.length,
            pendingExceptions: exceptions.filter(e => e.status !== 'Resolved').length,
            blockchainHeight: govChain.chain.length
        });
    }
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
router.get('/audit-logs', async (req, res) => {
    try {
        const supabase = require('../lib/supabaseClient');
        const { data: dbLogs, error } = await supabase.from('audit_logs').select(`*, citizens(id, email, role)`).order('timestamp', { ascending: false }).limit(50);
        
        if (!error && dbLogs?.length > 0) {
            return res.json(dbLogs.map(log => ({
                id: log.id,
                timestamp: log.timestamp,
                userNID: log.citizens?.id || log.user_id || 'SYS',
                userName: log.citizens?.email || 'SYSTEM',
                service: log.action,
                reason: log.action || 'System Process'
            })));
        }
    } catch (e) {}

    // Fallback
    const populated = accessLogs.map(log => {
        const user = users.find(u => u.id === log.userId);
        return { ...log, userNID: user?.nid || 'SYS', userName: user?.name || 'SYSTEM' };
    }).reverse();
    res.json(populated);
});

module.exports = router;
