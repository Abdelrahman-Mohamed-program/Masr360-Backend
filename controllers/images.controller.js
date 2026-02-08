const cloudinary  = require("../config/cloudinary");
const Night = require("../models/Night");


const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {entityType,entityId}= req.query;
    if (!id) {
      return res.status(400).json({ message: 'Image id is required' });
    }

      if (!entityId) {
      return res.status(400).json({ message: " entity's id is required"});
    }
    if (!entityId) {
      return res.status(400).json({ message: "entity type is required "});
    }

let Model;
if (entityType === "night") {
  Model = Night;
} else if (entityType === "place") {
  Model = Place;
} else if (entityType === "product") {
  Model = Product;
} else if (entityType === "specialEvent") {
  Model = SpecialEvent;
} else if(entityType === "governorate"){
    const result = await cloudinary.uploader.destroy(id);
     if (result.result === 'not found') {
      return res.status(404).json({ message: 'Image not found' });
    }

  return  res.json({ message: 'Deleted successfully', result });
} else {
  return res.status(400).json({ message: "Invalid entity type" });
}

// Atomic update: pull the image with matching publicId
const updatedDoc = await Model.findByIdAndUpdate(
  entityId,
  { $pull: { imgs: { publicId:id } } },
  { new: true } // return updated document
);

if (!updatedDoc) {
  return res.status(404).json({ message: "Entity not found" });
}


    const result = await cloudinary.uploader.destroy(id);


    if (result.result === 'not found') {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json({ message: 'Deleted successfully', result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    destroy
}