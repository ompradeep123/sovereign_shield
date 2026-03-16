const { accessLogs, threatLogs } = require('../db/mockDb');

const logActivity = (req, res, next) => {
  // Add to generalized threat radar logs based on endpoints
  const ip = req.ip || req.connection.remoteAddress;
  const path = req.originalUrl;
  const method = req.method;

  // Basic suspicious activity detection
  if (path.includes('.env') || path.includes('admin') && req.method === 'POST') {
     threatLogs.push({
       timestamp: new Date().toISOString(),
       ip,
       path,
       method,
       severity: 'HIGH',
       message: 'Suspicious path access attempted'
     });
  } else if (path.includes('login')) {
     threatLogs.push({
       timestamp: new Date().toISOString(),
       ip,
       path,
       method,
       severity: 'LOW',
       message: 'Login endpoint accessed'
     });
  }

  // Intercept response to log access data (Trust Timeline)
  if (req.user && path.includes('/api/services')) {
    accessLogs.push({
      userId: req.user.id,
      timestamp: new Date().toISOString(),
      service: 'API Gateway',
      reason: `Accessed ${method} ${path}`
    });
  }
  
  next();
};

module.exports = { logActivity };
