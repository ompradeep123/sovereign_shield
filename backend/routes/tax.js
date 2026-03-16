const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/tax-file', async (req, res) => {
    try {
        const citizenId = req.user.id;
        
        // Save tax filing request
        const { data, error } = await supabase
            .from('service_requests')
            .insert({
                citizen_id: citizenId,
                service_type: 'Income Tax Return FY2026',
                status: 'Processing via Gov Engine'
            })
            .select().single();

        if (error) throw error;
        
        // Log Audit Event
        await supabase.from('audit_logs').insert({
            action: 'Tax Service accessed income verification engine.',
            user_id: citizenId
        });

        res.json({ message: 'Tax filing registered successfully', filing: data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/tax-status', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('service_requests')
            .select('*')
            .eq('citizen_id', req.user.id)
            .ilike('service_type', '%Tax%')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
