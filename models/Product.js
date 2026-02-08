const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   img:{
    publicId:{
      type:String,required:true
    },
    url:{
      type:String,required:true
    }
  },
  tags:{
    type:Object,required:true
  },
  name: { type: String, required: true },
  price: { type: Number, default: 0 ,required: true },
  discount: { type: Number, default: 0,min:0,max:100,required: true  },
  quantity:
    { type: Number, default: 0,min:0,max:100,required: true  }
  ,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' ,required:true},
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);