const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res,next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { console.error(err);  next(err) }
};

exports.getOne = async (req, res,next) => {
  try {
    const u = await User.findById(req.params.id).select('-password');
    if (!u) return res.status(404).json({ message: 'Not found' });
    res.json(u);
  } catch (err) { console.error(err);  next(err)}
};

exports.updateUser = async (req, res,next) => {
  try {
    const data = req.body;
    // prevent role changes by non-admin (we will check in route)
    const updated = await User.findByIdAndUpdate(req.params.id, data, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { console.error(err);  next(err) }
};

exports.deleteUser = async (req, res,next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err);  next(err) }
};