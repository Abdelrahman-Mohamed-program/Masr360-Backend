const Review = require('../models/Review');
const Place = require('../models/Place');
const Product = require('../models/Product');
const Night = require('../models/Night');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const modelMap = {
  place: Place,
  product: Product,
  night: Night
};

const modelNameMap = { 
  place: 'Place',
  product: 'Product',
  night: 'Night'
};

exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { username, rate, title, desc, type, type_id } = req.body;
    const lowerType = String(type).toLowerCase();
    if (!modelMap[lowerType]) return res.status(400).json({ message: 'Invalid review type' });

    if (!mongoose.Types.ObjectId.isValid(type_id)) return res.status(400).json({ message: 'Invalid target id' });
    const target = await modelMap[lowerType].findById(type_id);
    if (!target) return res.status(404).json({ message: 'Target not found' });

    const review = new Review({
      username,
      rate,
      title,
      desc,
      type: modelNameMap[lowerType],
      target: type_id,
      user: req.user ? req.user._id : undefined
    });
    await review.save();

    // push to target reviews
    target.reviews = target.reviews || [];
    target.reviews.push(review._id);
    await target.save();

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getAll = async (req, res) => {
  try {
    const list = await Review.find().populate('user', 'username').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.getOne = async (req, res) => {
  try {
    const r = await Review.findById(req.params.id).populate('user', 'username');
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r.toObject());
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.deleteReview = async (req, res) => {
  try {
    const r = await Review.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });

    // only author or admin can delete
    if (!req.user) return res.status(401).json({ message: 'Login required' });
    if (req.user.role !== 'admin' && String(r.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }

    // remove from target
    const typeLower = r.type.toLowerCase();
    const model = modelMap[typeLower];
    if (model) {
      const target = await model.findById(r.target);
      if (target) {
        target.reviews = (target.reviews || []).filter(id => String(id) !== String(r._id));
        await target.save();
      }
    }

    await r.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};