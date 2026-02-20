const Night = require('../models/Night');
const { validationResult } = require('express-validator');
const mongoose = require("mongoose")
const uploadToCloudinary = require("../utils/uploadToCloudinary")


exports.createNight = async (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const body = req.body;
    const n = new Night(body);
    await n.save();
    res.status(201).json(n);
  } catch (err) { console.error(err);  next(err) }
};


exports.getAll = async (req, res, next) => {
  try {
   const page = req.query.page?Number(req.query.page)-1:0;
   const limit = req.query.limit?Number(req.query.limit):5;
   const governorate =  req.query.governorateId?req.query.governorateId:"";
   const category = req.query.categoryId?req.query.categoryId:"";
   const search = req.query.search||"";
   const sort = req.query.sort.split(",")||["avgRating"];
   

      let filter ={}
      if (category) {
        filter['category']=new mongoose.Types.ObjectId(category);
      }
      if (governorate) {
        filter['governorate'] = new mongoose.Types.ObjectId(governorate);
      }
      let sortBy  = {}
      if (sort.length > 1) {
        sortBy[sort[0]] = sort[1]==="desc"?-1:1;
      }else{
         sortBy[sort[0]] = 1;
      }
      
   const list = await Night.aggregate([
  {
    $match:{
      name:{
       $regex: search, $options: "i" 
      },
      ...filter
    }
  },
  {
    $lookup: {
      from: "governorates",
      localField: "governorate",
      foreignField: "_id",
      as: "governorate"
    }
  },

  
  {
    $unwind: {
      path: "$governorate",
      preserveNullAndEmptyArrays: true
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
  },
{
  $sort:sortBy
}
 ,
  {
   $facet: {
    data: [
      { $skip: page*limit },
      { $limit: limit }
    ],
    totalCount: [
      { $count: "count" }
    ]
  }
  }
  ,
  {
    $project: {
      reviews: 0
    }
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
   const { imgs, ...rest } = req.body; 
// newImages = array of { publicId, url }

const updated = await Night.findByIdAndUpdate(
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