const checkValidation = (req,res,next)=>{

const user = req.user;

if (!user.isVerified||user.isBanned) {
   return res.status(403).json({
       message: "Access denied"
    })
}


next();
}



module.exports = checkValidation