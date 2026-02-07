const Night = require('../models/Night');
const { validationResult } = require('express-validator');
const mongoose = require("mongoose")
exports.createNight = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const body = req.body;

    if (req.file) {
      console.log("came here");
      
     const img = `/uploads/nights/${req.file.filename}`;
     body['img'] = img
  }
  console.log(body.img);
  
    const n = new Night(req.body);
    await n.save();
    res.status(201).json(n);
  } catch (err) { console.error(err);  next(err) }
};

exports.getAll = async (req, res, next) => {
  try {

    const list = await Night.aggregate([
      {
        $lookup: {
          from: "reviews",
          let: { nightId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$nightId"] },
                    { $eq: ["$type", "night"] }
                  ]
                }
              }
            }
          ],
          as: "reviews"
        }
      },
      {
        $addFields: {
          avgRating: {
            $ifNull: [{ $avg: "$reviews.rate" }, 0]
          }
        }
      },
      {
        $project: { reviews: 0 }
      }
    ]);

    res.json(list);

  } catch (err) {
    console.error(err);
    next(err);
  }
};
exports.getOne = async (req, res, next) => {
  try {

   const night = await Night.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: "reviews",
          let: { nightId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$nightId"] },
                    { $eq: ["$type", "night"] }
                  ]
                }
              }
            }
          ],
          as: "reviews"
        }
      },
      {
        $addFields: {
          avgRating: {
            $ifNull: [{ $avg: "$reviews.rate" }, 0]
          },
          reviewsCount: { $size: "$reviews" }
        }
      }
    ]);

    if (!night.length)
      return res.status(404).json({ message: "Not found" });

    res.json(night[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateNight = async (req, res,next) => {
  try {
    console.log(req.body);
    
    const updated = await Night.findByIdAndUpdate(req.params.id, req.body, 
      {
     new: true, runValidators: true
    });
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