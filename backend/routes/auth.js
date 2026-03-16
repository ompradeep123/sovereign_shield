const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { users, threatLogs } = require('../db/mockDb');
const { JWT_SECRET } = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  const { nid, name, password } = req.body;
  
  if (users.find(u => u.nid === nid)) {
     return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: crypto.randomUUID(),
    nid,
    name,
    password: hashedPassword,
    role: 'citizen',
    attributes: {
      age: 28,
      citizenship: 'True',
      incomeEligibility: 'Tier 1'
    }
  };

  users.push(newUser);
  res.status(201).json({ message: 'Registration successful' });
});

router.post('/login', async (req, res) => {
  const { nid, password } = req.body;
  
  const user = users.find(u => u.nid === nid);
  if (!user) {
    threatLogs.push({ timestamp: new Date(), severity: 'MEDIUM', message: 'Failed login user not found', nid });
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    threatLogs.push({ timestamp: new Date(), severity: 'HIGH', message: 'Failed login wrong password', nid });
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate Session Token
  const token = jwt.sign({ id: user.id, role: user.role, nid: user.nid }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

module.exports = router;
