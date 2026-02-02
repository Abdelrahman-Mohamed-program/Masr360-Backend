const mongoose = require('mongoose');

const nightSchema = new mongoose.Schema({
  img:{type:String,required:true},
  name: { type: String, required: true },
  location:{type:String,required:true},
  locationIframe: { type: String ,required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

module.exports = mongoose.model('Night', nightSchema);