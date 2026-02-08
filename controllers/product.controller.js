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

exports.getAll = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      stock,
      category,
      sort
    } = req.query;

    const matchStage = {};

    // 🔎 Search (name or title)
    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    // 💰 Price range
    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = Number(minPrice);
      if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }

    // 📦 Stock filter
    if (stock === "in") {
      matchStage.quantity = { $gt: 0 };
    }
    if (stock === "out") {
      matchStage.quantity = 0;
    }

    // 🗂 Category filter
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    // 🔃 Sorting
let sortStage = { createdAt: -1 }; // default

if (sort) {
  const [field, order] = sort.split(",");

  const allowedFields = ["price", "avgRating", "createdAt", "priceAfterDiscount"];

  if (allowedFields.includes(field)) {
    sortStage = {
      [field]: order === "asc" ? 1 : -1
    };
  }
}

    const products = await Product.aggregate([
      // 🔥 Apply filters
      { $match: matchStage },

      // 🔥 Join reviews
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
            {
              $project: { rate: 1 }
            }
          ],
          as: "reviews"
        }
      },

      // ⭐ Ratings
      {
        $addFields: {
          avgRating: {
            $ifNull: [{ $avg: "$reviews.rate" }, 0]
          },
          reviewsCount: { $size: "$reviews" }
        }
      },

      // 💸 Price after discount
      {
        $addFields: {
          priceAfterDiscount: {
            $subtract: [
              "$price",
              {
                $multiply: [
                  "$price",
                  { $divide: ["$discount", 100] }
                ]
              }
            ]
          }
        }
      },

      // 🧹 Remove reviews array (optional, saves bandwidth)
      {
        $project: {
          reviews: 0
        }
      },

      // 🔃 Sorting
      { $sort: sortStage },

      // 📄 Pagination
      { $skip: (Number(page) - 1) * Number(limit) },
      { $limit: Number(limit) }
    ]);

    res.json({
      page: Number(page),
      limit: Number(limit),
      count: products.length,
      products
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const productArr = await Product.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id)
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
     const { imgs, ...rest } = req.body; 
    // newImages = array of { publicId, url }
    
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        // atomic push of new images
        ...(imgs && imgs.length > 0 ? { $push: { imgs: { $each: imgs } } } : {})
      },
      {
        new: true,
        runValidators: true
      }
    );

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