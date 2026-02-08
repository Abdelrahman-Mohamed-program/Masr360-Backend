const { default: mongoose } = require('mongoose');
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


exports.getOne = async (req, res, next) => {
  try {
    const productArr = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id)
        }
      },

      // 🔥 Populate category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
      },

      // 🔥 Get reviews for this product only
      {
        $lookup: {
          from: "reviews",
          let: { productId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$targetId", "$$productId"] },
                    { $eq: ["$type", "product"] }
                  ]
                }
              }
            },

        // ✅ Populate user
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },

        // Convert user array → object
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }
        },

        // Optional: select only username
        {
          $project: {
            rate: 1,
            title: 1,
            comment: 1,
            "user._id": 1,
            "user.username": 1
          }
        }
          ],
          as: "reviews"
        }
      },

      // 🔥 Calculate rating stats
      {
        $addFields: {
          avgRating: {
            $ifNull: [{ $avg: "$reviews.rate" }, 0]
          },
          reviewsCount: { $size: "$reviews" }
        }
      }
    ]);

    if (!productArr.length) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 Convert to object so we can modify safely
    const product = productArr[0];

    // ✅ Calculate price after discount OUTSIDE aggregation
    if (product.price && product.discount) {
      product.priceAfterDiscount =
        product.price - (product.price * product.discount) / 100;
    } else {
      product.priceAfterDiscount = product.price;
    }

    res.json(product);

  } catch (err) {
    console.error(err);
    next(err);
  }
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