const supabase = require('../lib/supabaseClient');

require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.log('GetUser Failed:', error, 'User:', user);
      // In a real demo if supabase is down/mocked, fallback for demo purposes
      if (process.env.SUPABASE_URL?.includes('mock')) {
        const jwt = require('jsonwebtoken');
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'sovereign_secret_key_123');
        req.user = verified;
        return next();
      }
      return res.status(400).json({ message: 'Invalid Token.', error: error ? error.message : 'No user found' });
    }

    // Map Supabase user metadata to req.user for backward compatibility
    req.user = {
      id: user.id,
      email: user.email,
      ...user.user_metadata
    };

    // Lazily sync the citizen to the public database to satisfy foreign key constraints
    if (!process.env.SUPABASE_URL?.includes('mock')) {
      try {
        await supabase.from('citizens').upsert({
          id: user.id,
          email: user.email,
          role: user.user_metadata?.role || 'citizen'
        }, { onConflict: 'id' });
      } catch (err) {
        // Ignore upsert errors to allow authentication to proceed
      }
    }

    next();
  } catch (error) {
    console.error("AuthMiddleware Error:", error);
    res.status(400).json({ message: 'Invalid Token.', error: error.toString() });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access Denied: Admin Clearance Required.' });
  }
};

module.exports = { verifyToken, verifyAdmin, JWT_SECRET };
