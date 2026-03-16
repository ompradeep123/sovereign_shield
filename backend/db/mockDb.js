/**
 * Mock Database Implementation for SovereignShield
 */
const crypto = require('crypto');

const users = [];
const services = [];
const hashChain = [];
const accessLogs = [];
const threatLogs = [];

// Helper to hash passwords and strings
const hashString = (str) => crypto.createHash('sha256').update(str).digest('hex');

// Pre-populate some data (e.g. admin)
setTimeout(() => {
  const bcrypt = require('bcrypt');
  bcrypt.hash('admin123', 10).then(hashed => {
    users.push({
      id: crypto.randomUUID(),
      nid: 'ADMIN-001',
      name: 'System Admin',
      password: hashed,
      role: 'admin',
      attributes: {
        clearance: 'Level 5',
        department: 'Cyber Command'
      }
    });
  });
}, 0);

module.exports = {
  users,
  services,
  hashChain,
  accessLogs,
  threatLogs,
  hashString
};
