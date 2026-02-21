const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   imgs:{
   type:Array,required:true
  },
  tags:{
    type:Object,required:false
  },
  name: { type: String, required: true },
  desc:{
    type:String,required:true
  },
  price: { type: Number, default: 0 ,required: true },
  discount: { type: Number, default: 0,min:0,max:100,required: false  },
  quantity:
    { type: Number, default: 0,min:0,max:10000,required: true  }
  ,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' ,required:true},
   
     translations:{
       type:Object,required:true,
     }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);