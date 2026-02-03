const Governorate = require("../models/Governorates");
const { validationResult } = require("express-validator");
const Place = require("../models/Place");

exports.createGov = async (req, res, next) => {
  const img = `/uploads/governorates/${req.file.filename}`;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const gov = new Governorate({
      img,
      name:req.body.name,
      desc:req.body.desc,
    });
    await gov.save();

    
    if (req.body?.places) {
      let places = req.body.places;
      places = places.replace(/'/g, '"') //replacing all ' with "
            console.log(places)
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
    const sort = req.query.sort? req.query.sort.split(","):"name";

    let sortBy = {}

    if (sort.length>1) {
      sortBy[sort[0]]=sort[1];
    }else{
      sortBy[sort[0]]="asc"
    }
    
    const governorates = await Governorate.find({name:{$regex:search,$options:"i"}}).sort(sortBy);
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

    const places = await Place.find({ governorate: g._id });
    res.json({
      g: { ...g, places },
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
       body.img = `/uploads/governorates/${req.file.filename}`;
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
