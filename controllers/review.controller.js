const Review = require('../models/Review');
const Place = require('../models/Place');
const Product = require('../models/Product');
const Night = require('../models/Night');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const modelMap = {
  Place: Place,
  Product: Product,
  Night: Night
};



exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    let { username, rate, title, desc, targetId,type } = req.body;
    type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    if (!modelMap[type]) return res.status(400).json({ message: 'Invalid review type' });

    if (!mongoose.Types.ObjectId.isValid(targetId)) return res.status(400).json({ message: 'Invalid target id' });
    const target = await modelMap[type].findById(targetId);
    if (!target) return res.status(404).json({ message: 'Target not found' });

    const review = new Review({
      username,
      rate,
      title,
      desc,
      type,
      targetId,
      user: req.user._id
    });
    await review.save();


    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getAll = async (req, res) => {
  try {
  
    const sort = req.query.sort? req.query.sort.split(","):["createdAt"];
    const search = req.query.search||"";
    const limit = Number(req.query.limit)||5;
    const page = Number(req.query.page)-1||0;

    let filter = {}
    let sortBy = {}
    if (req.query.type) {
      filter = {type:req.query.type.toLowerCase()};
    }

    if (sort.length>1) {
      sortBy[sort[0]]=sort[1]==="desc"?-1:1;
    }else{
        sortBy[sort[0]]=1;
    }

    const list = await Review.find({
      ...filter,
      title:{
        $regex:search,$options:"i"
      }
    }).populate('user', 'username').sort(sortBy).skip(page*limit).limit(limit);
    res.json(list);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.getOne = async (req, res) => {
  try {
      const id = req.params.id||"";
    if (!id||!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        "message":"invalid id"
      })
    }
    const r = await Review.findById(req.params.id).populate('user', 'username');
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json(r.toObject());
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.updateOne = async (req, res) => {
  try {

    let {targetId,user,type} = req.body;
    
    if (user) {
    return res.status(403).json({
        message:"invalid operation"
      })
    }
    if (targetId||type) {
      type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
     if (!modelMap[type]) return res.status(400).json({ message: 'Invalid review type' });
      
      if (!mongoose.Types.ObjectId.isValid(targetId)) return res.status(400).json({ message: 'Invalid target id' });
     const target = await modelMap[type].findById(targetId);
      if (!target) return res.status(404).json({ message: 'Target not found' });
     
    }

    const r = await Review.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    if (!r) return res.status(404).json({ message: 'Not found' });
    res.json({
      r,
      message:"updated"
    });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};

exports.deleteReview = async (req, res) => {
  try {
    const r = await Review.findById(req.params.id).populate('user','_id');
   
    
    if (!r) return res.status(404).json({ message: 'Not found' });

    // only author or admin can delete

    if (req.user.role !== 'admin' && String(r.user._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete' });
    }

   await  r.deleteOne();
      
    res.json({ message: 'Deleted' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
};