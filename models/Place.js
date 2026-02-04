const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  imgs:{type:Array},
  name: { type: String, required: true },
  desc: { type: String,required: true  },
  location:{type:String,required:true},
  locationIframe: { type: String ,required: true },
  governorate: { type: mongoose.Schema.Types.ObjectId, ref: 'Governorate', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  lang:{type:String,enum:["AR","EN"],required:true},
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);