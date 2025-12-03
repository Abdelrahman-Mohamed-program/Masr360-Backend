const mongoose = require('mongoose');

const governmentSchema = new mongoose.Schema({
  img:{type:String,required:true},
  name: { type: String, required: true },
  desc: { type: String,required: true  },
}, { timestamps: true });

module.exports = mongoose.model('Governorate', governmentSchema);