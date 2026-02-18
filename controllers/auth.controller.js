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
    if (!user.isVerified) {
      return res.status(400).json({
        message:"user is not verified"
      })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: "15d" });
    res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
           sameSite: 'None',
            maxAge: 15 * 24 * 60 * 60 * 1000,
            path: '/auth/refresh'
        });
    res.status(200).json({ accessToken, user: { id: user._id,email:user.email, username: user.username} });
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.refresh = async(req,res,next)=>{
  try {
      if(!req.cookies?.jwt){
   return res.status(401).json({
      message:"Unauthorized"
    })
  }
   const refreshToken = req.cookies.jwt;
   const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ id: decoded.id,role:decoded.role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(200).json({
      accessToken
    })
  } catch (error) {
    console.log(error);
   return res.status(401).json({
      message:"Unauthorized"
    })
  }

}

