const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const serviceRoutes = require('./routes/services'); // Keep fallback for existing UI hooks
const adminRoutes = require('./routes/admin');
const certRoutes = require('./routes/certificate');
const taxRoutes = require('./routes/tax');
const eligibilityRoutes = require('./routes/eligibility');
const { logActivity } = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares - API Gateway simulation
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later."
});
app.use(limiter);

// Custom Request Logging
app.use(logActivity);

// Routes
// Microservices Routing Layer (API Gateway Routing)
app.use('/api/services', serviceRoutes);     // Existing fallback
app.use('/api/certificates', certRoutes);    // Real Microservice - Blockchain Certificate Flow
app.use('/api/tax', taxRoutes);              // Real Microservice - Taxation Portal
app.use('/api/eligibility', eligibilityRoutes); // Real Microservice - ZKP verification

app.use('/api/admin', adminRoutes);          // Monitoring SIEM tools

// Health check and resilience info
app.use('/api/status', (req, res) => {
  const isBackup = process.env.USE_BACKUP_NODE === 'true';
  res.json({
    status: 'ONLINE',
    node: isBackup ? 'Backup Node' : 'Primary Node',
    uptime: process.uptime(),
    lastBackup: new Date(Date.now() - 3600000).toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`SovereignShield Backend Node (Primary) running on port ${PORT}`);
});
