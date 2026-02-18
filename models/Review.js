const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  rate: { type: Number, min: 0, max: 5, required: true },
  title: { type: String,required:true },
  desc: { type: String,required:true },
  type: { type: String, enum: ['Place','Product','Night'], required: true },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type' // dynamic reference to model name: 'place' -> 'Place', 'product' -> 'Product', 'night' -> 'Night'
  },
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Note: when using refPath, Mongoose expects the ref to match model names.
// We'll ensure when creating reviews we pass type values: 'Place','Product','Night' or map them below.

module.exports = mongoose.model('Review', reviewSchema);