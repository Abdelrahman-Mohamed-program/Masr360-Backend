const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  imgs:{type:Array},
  name: { type: String, required: true },
  desc: { type: String,required: true  },
  category: { type: String ,required: true },
  subCategory: { type: String ,required: true },
  location:{type:String,required:true},
  locationIframe: { type: String ,required: true },
  governorate: { type: mongoose.Schema.Types.ObjectId, ref: 'Governorate', required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);