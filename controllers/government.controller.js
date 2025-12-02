const Government = require('../models/Government');
const { validationResult } = require('express-validator');

exports.createGov = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const gov = new Government(req.body);
    await gov.save();
    res.status(201).json(gov);
  } catch (err) {
    next(err)
  }
};

exports.getAll = async (req, res,next) => {
  try {
    const list = await Government.find();
    res.json(list);
  } catch (err) {
    console.error(err);
     next(err)
  }
};

exports.getOne = async (req, res,next) => {
  try {
    const g = await Government.findById(req.params.id);
    if (!g) return res.status(404).json({ message: 'Not found' });
    res.json(g);
  } catch (err) {
    console.error(err);
     next(err)
  }
};

exports.updateGov = async (req, res,next) => {
  try {
    const updated = await Government.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.deleteGov = async (req, res,next) => {
  try {
    const deleted = await Government.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
     next(err)
  }
};