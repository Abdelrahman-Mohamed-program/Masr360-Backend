const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  img:{type:String},
  name: { type: String, required: true },
  category: { type: String,required: true  },
  price: { type: Number, default: 0 ,required: true },
  discount: { type: Number, default: 0,required: true  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);