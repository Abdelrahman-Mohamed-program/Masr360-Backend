const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username,email, password, phoneNumber, location,role } = req.body;
    let user = await User.findOne({ email });


    const hashed = await bcrypt.hash(password, 10);
    user = new User({ username,email, password: hashed, phoneNumber, location, ip: req.ip ,role});
    await user.save();

    const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, email:user.email,username: user.username, role: user.role } });
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
    res.json({ token, user: { id: user._id,email:user.email, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err);
    next(err)
  }
};