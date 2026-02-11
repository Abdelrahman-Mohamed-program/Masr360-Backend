const mongoose = require("mongoose")

const UserOtpVerificationSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    otp:String,
    createdAt:Date,
    expiresAt:{
        type:Date,
         required: true,
        index: { 
            expires: 0  // TTL in seconds — 0 = delete immediately after the date
        }
    }
})


const UserOtpVerification = new mongoose.model('UserOtpVerification',UserOtpVerificationSchema);

module.exports = UserOtpVerification;