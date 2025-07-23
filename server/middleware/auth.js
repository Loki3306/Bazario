const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Middleware to check if user is merchant
const requireMerchant = (req, res, next) => {
  if (req.user.role !== 'merchant') {
    return res.status(403).json({ error: 'Access denied. Merchant role required.' });
  }
  next();
};

module.exports = { auth, requireMerchant };