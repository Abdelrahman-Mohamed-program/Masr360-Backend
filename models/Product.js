const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  img:{type:String},
  name: { type: String, required: true },
  price: { type: Number, default: 0 ,required: true },
  discount: { type: Number, default: 0,min:0,max:100,required: true  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);