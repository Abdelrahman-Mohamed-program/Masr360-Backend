const mongoose = require('mongoose');

const GovernorateSchema = new mongoose.Schema({
  img:{
    publicId:{
      type:String,required:true
    },
    url:{
      type:String,required:true
    }
  },
  name: { type: String, required: true },
  desc: { type: String,required: true  },
  // lang:{type:String,enum:["AR","EN"],required:true},
  translations : {
    type:Object,
    required:true
  }
}, { timestamps: true });

module.exports = mongoose.model('Governorate', GovernorateSchema);