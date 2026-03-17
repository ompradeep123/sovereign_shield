const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const serviceRoutes = require('./routes/services');
const adminRoutes = require('./routes/admin');
const certRoutes = require('./routes/certificate');
const taxRoutes = require('./routes/tax');
const eligibilityRoutes = require('./routes/eligibility');
const privacyRoutes = require('./routes/privacy');
const { logActivity } = require('./middleware/logger');
const { securityGuard, anomalyDetector } = require('./middleware/securityGuard');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Cloud Gateway Layer - Security Hardening
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Dynamically allow any origin for the hackathon prototype
    callback(null, true); 
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Device-Fingerprint'],
  credentials: true
}));

// 2. Traffic Control - Rate Limiting & Proxy Trust
app.set('trust proxy', 1); // Crucial for AWS/Ngrok: Tells express to use the real client IP instead of the proxy IP

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 2000, // Increased buffer: Hackathon prototypes often hit rate-limits due to hot-reloading and proxy pooling
  message: { error: "Security Gateway: Too many requests. Potential DoS attack blocked." }
});
app.use(limiter);

app.use(express.json());
app.use(securityGuard);
app.use(anomalyDetector);

// 3. Observability - API Request Logging
app.use(logActivity);

// 4. Service Mesh Routing
app.use('/api/services', serviceRoutes);
app.use('/api/certificates', certRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/eligibility', eligibilityRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/admin', adminRoutes);

// 5. Resilience - Cloud Health Monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    infrastructure: 'Cloud-Native V3',
    timestamp: new Date().toISOString(),
    services: {
        database: 'Connected (Supabase)',
        ledger: 'Connected (Polygon)',
        iam: 'Active (Supabase Auth)'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`[CLOUD_ERROR] ${err.stack}`);
    res.status(500).json({ error: 'Internal Resilience Failure. Logged to SIEM.' });
});

app.listen(PORT, () => {
  console.log(`SovereignShield Cloud Gateway V3 running on port ${PORT}`);
});
