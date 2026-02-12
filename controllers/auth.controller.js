const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { username,email, password, phoneNumber, location,isVerified=false } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message:"user already registered"
      })
    }
    const saltRounds = parseInt(process.env.SALTROUND, 10) || 10; 
    const hashed = await bcrypt.hash(password, saltRounds);
    user = new User({ username,email, password: hashed, phoneNumber,isVerified, location,role:"user", ip: req.ip});
    await user.save();

   
    res.status(201).json({ user: { id: user._id, email:user.email,username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
   next(err)
  }
};

exports.login = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { password,email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(200).json({ token, user: { id: user._id,email:user.email, username: user.username} });
  } catch (err) {
    console.error(err);
    next(err)
  }
};