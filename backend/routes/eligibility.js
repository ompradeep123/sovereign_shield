const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabaseClient');
const { verifyToken } = require('../middleware/authMiddleware');
const { generateZKP, verifyZKP } = require('../zkp/zkpSim');

router.use(verifyToken);

router.get('/verify', async (req, res) => {
    try {
        const citizenId = req.user.id;

        // In a real database this would be a secure ZKP mapping table. Here we use mock logic bound to the user id.
        const mockAttributes = req.user.user_metadata || { age: 28, citizenship: 'Verified', incomeEligibility: 'Eligible Tier 2' };

        const proofs = [
            { property: 'Age Over 18', proof: generateZKP('Age', mockAttributes.age || 30) },
            { property: 'National Origin', proof: generateZKP('Citizenship', mockAttributes.citizenship || 'Verified') }
        ];

        // Ensure trust timeline audibility
        await supabase.from('audit_logs').insert({
            action: 'Zero-Knowledge Proofs generated for Service Eligibility',
            user_id: citizenId
        });

        res.json({ valid: true, proofs });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
