const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, },
  phoneNumber: { type: String,required: true },
  location: { type: String,required: true },
  ip: { type: String },
  isVerified:{
    type:Boolean,default:false
  },
   isBanned:{
    type:Boolean,default:false
  },
  password: { type: String, required: true },
  email: { type: String, required: true ,unique: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);