const helmet = require('helmet');

/**
 * Enhanced Security Layer for SovereignShield
 * Protects against common vectors like SQLi, XSS, and Malicious payloads
 * beyond standard middleware.
 */
const securityGuard = (req, res, next) => {
    // 1. Payloads Inspection (Simple Anomaly Detection)
    const body = JSON.stringify(req.body || {});
    const query = JSON.stringify(req.query || {});
    
    const maliciousPatterns = [
        /<script/i,           // XSS
        /UNION SELECT/i,      // SQLi
        /OR '1'='1'/i,       // SQLi bypass
        /\.\.\//,             // Path Traversal
        /DROP TABLE/i         // Data Destruction
    ];

    const isMalicious = maliciousPatterns.some(pattern => 
        pattern.test(body) || pattern.test(query) || pattern.test(req.url)
    );

    if (isMalicious) {
        console.warn(`[SECURITY_ALERT] Malicious pattern detected from IP: ${req.ip}`);
        // In a real system, we'd trigger an AI anomaly alert here
        return res.status(403).json({ 
            error: 'SECURITY_VIOLATION', 
            message: 'Gateway Intercept: Potential malicious payload detected.' 
        });
    }

    // 2. Extra Security Headers (Defense in Depth)
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    
    next();
};

/**
 * Simulated AI Anomaly Detector
 * Analyzes traffic patterns for bot behaviors or unusual spikes
 */
const anomalyDetector = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        
        // Simulating "AI logic": High latency or unusual status codes trigger an anomaly log
        if (duration > 1500 || res.statusCode === 429) {
            console.log(`[AI_RADAR] Anomaly detected: Latency ${duration}ms at ${req.originalUrl}`);
            // Logic to log to 'threat_logs' for the Admin Radar to see
        }
    });
    
    next();
};

module.exports = { securityGuard, anomalyDetector };
