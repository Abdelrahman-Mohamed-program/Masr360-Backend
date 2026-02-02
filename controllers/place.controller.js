const Place = require("../models/Place");
const Governorate = require("../models/Governorates");
const { validationResult } = require("express-validator");

exports.createPlace = async (req, res, next) => {
  
  try {
    const imgs = req.files;
   

    if (!Array.isArray(imgs) ) {
      return res.status(400).json({ message: "imgs must be an array" });
    }
    const { governorate } = req.body;
    const gov = await Governorate.findById(governorate);
    if (!gov) return res.status(400).json({ message: "Governorate not found" });

    const place = new Place(req.body);
    await place.save();
    res.status(201).json(place);
  } catch (err) {
    console.error(err);
   next(err)
  }
};

exports.getAll = async (req, res, next) => {
  try {
   const list = await Place.find().populate("governorate", "name _id");
    res.json(list);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getOne = async (req, res,next) => {
  try {
    const p = await Place.findById(req.params.id)
      .populate("governorate")
      .populate("reviews");
    if (!p) return res.status(404).json({ message: "Not found" });
    res.json(p.toObject());
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updatePlace = async (req, res, next) => {
  try {
    const updated = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deletePlace = async (req, res, next) => {
  try {
    const deleted = await Place.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
