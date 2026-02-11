const { verify } = require("../config/nodemailer");
const User = require("../models/User");
const UserOtpVerification = require("../models/UserOtpVerification");
const generateOTP = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const otpTemplate = require("../views/emailTemplates/otpTemplate");
const bcrypt = require("bcrypt")

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
      console.log("s`df");
      
       const otp = generateOTP();
       const message = "Use this code to verify your email";
       const template = otpTemplate(otp,message)

       
       const salt =  parseInt(process.env.SALTROUND, 10) || 10; 
       const hashedOtp = await bcrypt.hash(otp, salt);
        
        const obj =   new UserOtpVerification({
            userId,
            otp:hashedOtp,
            createdAt:Date.now(),
            expiresAt:Date.now()+3600000
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
    sendOtp
}