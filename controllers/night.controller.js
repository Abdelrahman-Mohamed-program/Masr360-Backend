const Night = require('../models/Night');
const { validationResult } = require('express-validator');

exports.createNight = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const n = new Night(req.body);
    await n.save();
    res.status(201).json(n);
  } catch (err) { console.error(err);  next(err) }
};

exports.getAll = async (req, res,next) => {
  try {
    const list = await Night.find().populate('reviews');
    res.json(list);
  } catch (err) { console.error(err);  next(err) }
};

exports.getOne = async (req, res,next) => {
  try {
    const n = await Night.findById(req.params.id).populate('reviews');
    if (!n) return res.status(404).json({ message: 'Not found' });
    res.json(n);
  } catch (err) { console.error(err);  next(err) }
};

exports.updateNight = async (req, res,next) => {
  try {
    const updated = await Night.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { console.error(err);  next(err)}
};

exports.deleteNight = async (req, res,next) => {
  try {
    const deleted = await Night.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err);  next(err) }
};