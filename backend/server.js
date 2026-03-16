const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const adminRoutes = require('./routes/admin');
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
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);

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
