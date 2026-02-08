const mongoose = require('mongoose');

const nightSchema = new mongoose.Schema({
  imgs:{type:Array,required:true},
  desc:{type:String,required:true},
  name: { type: String, required: true },
  location:{
    type:String,
    required:true,
  },
  lang:{type:String,required:true,enum:["AR","EN"]},
  locationIframe: { type: String ,required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' ,required:true},
  governorate:{ type: mongoose.Schema.Types.ObjectId, ref: 'Governorate',required:true  },
}, { timestamps: true });

module.exports = mongoose.model('Night', nightSchema);