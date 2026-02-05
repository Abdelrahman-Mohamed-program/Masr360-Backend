const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
     type: String, required: true 
    },
  type:{
  type:String,
  enum:["place","night","product"],
  required:true
  },
  icon:{
    type:String
  }
    ,
    parent:{
    type: mongoose.Schema.Types.ObjectId, ref: 'Category',
    required: false
    },
  lang:{
    type:String,enum:["AR","EN"],required:true
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);