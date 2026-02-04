const mongoose = require('mongoose');

const GovernorateSchema = new mongoose.Schema({
  img:{type:String,required:false},
  name: { type: String, required: true },
  desc: { type: String,required: true  },
  lang:{type:String,enum:["AR","EN"],required:true}
}, { timestamps: true });

module.exports = mongoose.model('Governorate', GovernorateSchema);