 const mongoose = require("mongoose");
 const  validateId = async(req,res,next)=>{
    try {
        const id = req.params.id||"";
    if (!id||!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        "message":"invalid id"
      })
    }

    next();
    } catch (error) {
        next(error);
    }
  
}


module.exports = validateId;