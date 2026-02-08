const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   imgs:{
   type:Array,required:true
  },
  tags:{
    type:Object,required:false
  },
  name: { type: String, required: true },
  price: { type: Number, default: 0 ,required: true },
  discount: { type: Number, default: 0,min:0,max:100,required: false  },
  quantity:
    { type: Number, default: 0,min:0,max:100,required: true  }
  ,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' ,required:true},
    lang:{type:String,required:true,enum:["AR","EN" ]},
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);