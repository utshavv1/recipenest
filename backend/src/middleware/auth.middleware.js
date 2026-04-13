const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET } = require('../config/config');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'User not found or inactive' });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Invalid token' });
    if (error.name === 'TokenExpiredError') return res.status(401).json({ success: false, message: 'Token expired' });
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const chefOnly = (req, res, next) => {
  if (req.user && req.user.role === 'chef') next();
  else res.status(403).json({ success: false, message: 'Access denied: Chef only' });
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ success: false, message: 'Access denied: Admin only' });
};

const chefOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'chef' || req.user.role === 'admin')) next();
  else res.status(403).json({ success: false, message: 'Access denied: Chef or Admin only' });
};

module.exports = { protect, chefOnly, adminOnly, chefOrAdmin };