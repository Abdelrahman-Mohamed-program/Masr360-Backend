const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
   
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
  
    
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};