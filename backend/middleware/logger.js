const supabase = require('../lib/supabaseClient');

const logActivity = async (req, res, next) => {
    const start = Date.now();
    
    // Once the response is finished
    res.on('finish', async () => {
        const duration = Date.now() - start;
        const logEntry = {
            method: req.method,
            endpoint: req.originalUrl,
            status: res.statusCode,
            duration,
            ip: req.ip || req.header('x-forwarded-for') || '127.0.0.1',
            timestamp: new Date().toISOString()
        };

        // If status is an error or unauthorized, log as potential threat
        if (res.statusCode >= 400) {
            try {
                await supabase.from('threat_logs').insert({
                    event_type: `API_${res.statusCode}_ERROR`,
                    ip_address: logEntry.ip,
                    severity: res.statusCode === 401 || res.statusCode === 403 ? 'MEDIUM' : 'LOW'
                });
            } catch(e) {}
        }

        // For demo auditing of service requests
        if (req.method === 'POST' && req.originalUrl.includes('/api/')) {
            console.log(`[LOG] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
        }
    });

    next();
};

module.exports = { logActivity };
