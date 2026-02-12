const { verify } = require("../config/nodemailer");
const User = require("../models/User");
const UserOtpVerification = require("../models/UserOtpVerification");
const generateOTP = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const otpTemplate = require("../views/emailTemplates/otpTemplate");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const validateOtp = async (req, res, next) => {
  try {
    const { _id, otp } = req.body;

    // 1️⃣ Validate input
    if (!_id || !otp) {
      return res.status(400).json({
        message: "OTP and user id are required"
      });
    }

    // 2️⃣ Find user
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isVerified) {
        return res.status(400).json({
            message:"user already verified"
        })
    }
    // 3️⃣ Find OTP record
    const otpRecord = await UserOtpVerification.findOne({
      userId: _id
    });

    // If OTP expired → TTL removed it → treated as invalid
    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    // 4️⃣ Compare OTP
    const isMatch = await bcrypt.compare(String(otp), otpRecord.otp);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }


      user.isVerified = true;
      await user.save();
    

    // 6️⃣ Delete OTP (prevents reuse)
    await UserOtpVerification.deleteOne({ userId: _id });

    // 7️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 8️⃣ Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};

const sendOtp = async (req,res,next)=>{
    try {

        const {email} =req.body;
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({
                message:"User not found"
            })
        }
     
        const userId = user._id;

      await UserOtpVerification.deleteMany({
        userId
      }); 
       const otp = generateOTP();
       const message = "Use this code to verify your email";
       const template = otpTemplate(otp,message)

       
       const salt =  parseInt(process.env.SALTROUND, 10) || 10; 
       const hashedOtp = await bcrypt.hash(otp, salt);
        
        const obj =   new UserOtpVerification({
            userId,
            otp:hashedOtp,
            createdAt:Date.now(),
            expiresAt:Date.now()+(20 * 60 * 1000)
        })
        await obj.save()
        await  sendEmail(email,template);
        res.json({
            message:"Verfication email sent",
            data:{
                userId,
                email
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    sendOtp,
    validateOtp
}