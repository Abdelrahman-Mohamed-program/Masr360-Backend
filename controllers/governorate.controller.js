const Governorate = require("../models/Governorates");
const { validationResult } = require("express-validator");
const Place = require("../models/Place");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.createGov = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {

    if (!req.file) {
      return res.status(400).json({
         "errors": [
        {
            "type": "field",
            "msg": "img field required",
            "path": "img",
            "location": "body"
        }
    ]
      })
    }

    

     const result = await uploadToCloudinary(req.file.buffer);
     const img = {
      publicId:result.public_id,
      url:result.url
     }
      let governorate = { 
       img,
      name:req.body.name[0].toUpperCase()+req.body.name.slice("1"),
      desc:req.body.desc,
      lang:req.body.lang?req.body.lang.toUpperCase():""
    }
   
   

    const gov = new Governorate(
      governorate
    );
    await gov.save();

    
    if (req.body?.places) {
      let places = req.body.places;
      places = places.replace(/'/g, '"') //replacing all ' with "
        
      places = JSON.parse(places)


      const placesWithGovId = places.map((p) => ({
        ...p,
        governorate: gov._id,
      }));
      await Place.insertMany(placesWithGovId);
    }
    res.status(201).json(gov);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const search = req.query.search||"";
    const sort = req.query.sort? req.query.sort.split(","):["name"];
    const lang = req.query.lang?req.query.lang.toUpperCase():"EN"
    let sortBy = {}

    if (sort.length>1) {
      sortBy[sort[0]]=sort[1]==="desc"?-1:1;
    }else{
      sortBy[sort[0]]=1
    }

const governorates = await Governorate.aggregate([
  {
    $match: {
      name: { $regex: search, $options: "i" },
      lang
    }
  },
  {
    $lookup: {
      from: "places", // collection name (IMPORTANT: lowercase plural usually)
      localField: "_id",
      foreignField: "governorate",
      as: "places"
    }
  },
  {
    $addFields: {
      placesCount: { $size: "$places" }
    }
  },
  {
    $project: {
      places: 0 // remove places array if you only want count
    }
  },
  {
    $sort: sortBy
  }
]);

    res.json(governorates);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {

    const g = await Governorate.findById(req.params.id).lean();
    if (!g) return res.status(404).json({ message: "Not found" });

    const places = await Place.find({ governorate: g._id});
    res.json({
      governorate: { ...g, places },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateGov = async (req, res, next) => {
  try {
   const body = {...req.body}
    if (req.file) {
     const result = await uploadToCloudinary(req.file.buffer);
     body.img = {
      publicId:result.public_id,
      url:result.url
     };
    } 
     
      
    const updated = await Governorate.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated.toObject());
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteGov = async (req, res, next) => {
  try {
    const deleted = await Governorate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
