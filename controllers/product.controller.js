const Product = require('../models/Product');
const { validationResult } = require('express-validator');


exports.createProduct = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const p = new Product(req.body);
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    next(err)
  }
};

exports.getAll = async (req, res,next) => {
  try {
    const list = await Product.find().populate('reviews');
    res.json(list);
  } catch (err) { console.error(err);  next(err)}
};

exports.getOne = async (req, res,next) => {
  try {
    const p = await Product.findById(req.params.id).populate('reviews');
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p.toObject());
  } catch (err) { console.error(err);  next(err)}
};

exports.updateProduct = async (req, res,next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated.toObject());
  } catch (err) { console.error(err);  next(err)}
};

exports.deleteProduct = async (req, res,next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err);  next(err) }
};