const mongoose = require('mongoose');

const nightSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location:{type:String,required:true},
  locationIframe: { type: String ,required: true },
  category: { type: String,required: true  },
  subCategory: { type: String,required: true  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
}, { timestamps: true });

module.exports = mongoose.model('Night', nightSchema);