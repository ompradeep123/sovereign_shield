const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

/**
 * FEATURE 1: DATA ACCESS HISTORY
 * Pulls history from data_access_logs
 */
router.get('/access-history', async (req, res) => {
    try {
        const { data: logs, error } = await supabase
            .from('data_access_logs')
            .select('*')
            .eq('citizen_id', req.user.id)
            .order('timestamp', { ascending: false });

        if (error && !process.env.SUPABASE_URL?.includes('mock')) {
            console.error('Fetch Logs Error:', error);
        }

        // Fallback high-fidelity mock data for prototype demonstration
        const history = (logs && logs.length > 0) ? logs : [
            { id: 1, service_name: 'Tax Department', attribute_accessed: 'Income_Eligibility', purpose: 'Tax Filing Verification', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 2, service_name: 'Health Service', attribute_accessed: 'Age_Verified', purpose: 'Healthcare Subsidy Check', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: 3, service_name: 'Election Commission', attribute_accessed: 'Citizenship_Status', purpose: 'Voter List Validation', timestamp: new Date(Date.now() - 172800000).toISOString() },
            { id: 4, service_name: 'Digital Welfare', attribute_accessed: 'Residential_Status', purpose: 'Local Benefit Eligibility', timestamp: new Date(Date.now() - 259200000).toISOString() }
        ];

        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * FEATURE 2: DATA PERMISSION MANAGEMENT
 * Citizens control which services can access their attributes
 */
router.get('/permissions', async (req, res) => {
    try {
        const { data: perms, error } = await supabase
            .from('data_permissions')
            .select('*')
            .eq('citizen_id', req.user.id);

        if (error && !process.env.SUPABASE_URL?.includes('mock')) {
            console.error('Fetch Perms Error:', error);
        }

        const defaultPerms = (perms && perms.length > 0) ? perms : [
            { service_name: 'Tax Department', attribute: 'Income Eligibility', permission_status: 'allow' },
            { service_name: 'Health Service', attribute: 'Age Verification', permission_status: 'allow' },
            { service_name: 'Passport Control', attribute: 'Citizenship Status', permission_status: 'allow' },
            { service_name: 'Education Bureau', attribute: 'Academic History', permission_status: 'deny' },
            { service_name: 'Housing Authority', attribute: 'Property Records', permission_status: 'deny' }
        ];

        res.json(defaultPerms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/permissions/update', async (req, res) => {
    try {
        const { service_name, attribute, permission_status } = req.body;
        
        // Zero Trust Principle: Only the citizen can update their own permissions
        const { error } = await supabase
            .from('data_permissions')
            .upsert({
                citizen_id: req.user.id,
                service_name,
                attribute,
                permission_status,
                updated_at: new Date().toISOString()
            });

        if (error && !process.env.SUPABASE_URL?.includes('mock')) throw error;

        // Log the change in the main audit trail for transparency
        await supabase.from('audit_logs').insert({
            action: `[PRIVACY_CENTER] Changed permission for ${service_name} (${attribute}) to ${permission_status.toUpperCase()}`,
            user_id: req.user.id
        });

        res.json({ success: true, message: `Permission updated successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * FEATURE 5: TRANSPARENCY SCORE
 * Calculating a "Trust Score" based on security settings
 */
router.get('/transparency-score', async (req, res) => {
    // Logic: Combined weight of security features
    // In a prod app, we'd check DB for real settings
    const scoreFactors = [
        { name: 'MFA Armed', active: true, weight: 25 },
        { name: 'Biometric Verification', active: true, weight: 25 },
        { name: 'Restricted Sharing', active: true, weight: 20 },
        { name: 'Trusted Device Lock', active: false, weight: 15 },
        { name: 'Encrypted Recovery', active: true, weight: 15 }
    ];

    const currentScore = scoreFactors.reduce((acc, f) => acc + (f.active ? f.weight : 0), 0);
    
    res.json({
        score: currentScore,
        maxScore: 100,
        factors: scoreFactors
    });
});

/**
 * FEATURE 6: DATA ACCESS REQUEST SYSTEM
 * Services requesting transient access to sensitive data
 */
router.get('/requests', async (req, res) => {
    // Mocking active requests that require citizen intervention
    res.json([
        { id: 'REQ-9102', service: 'Financial Integrity Cabinet', attribute: 'Net Savings Balance', purpose: 'Standard Annual Asset Review', urgency: 'Medium' },
        { id: 'REQ-8841', service: 'Ministry of Infrastructure', attribute: 'Vehicle Registration', purpose: 'Smart Toll Eligibility Verification', urgency: 'Low' }
    ]);
});

router.post('/requests/respond', async (req, res) => {
    const { requestId, action } = req.body; // action: approve | reject
    
    // Log response
    await supabase.from('audit_logs').insert({
        action: `[DATA_REQUEST_RESPONDED] Citizen ${action}ed data request ${requestId}`,
        user_id: req.user.id
    });

    res.json({ success: true, message: `Request ${action}ed.` });
});

module.exports = router;
