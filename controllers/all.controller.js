const Governorates = require("../models/Governorates");
const Night = require("../models/Night");
const Place = require("../models/Place");
const User = require("../models/User");


const search = async(req,res,next)=>{
try {
    const search = req.query?.search||"";
    const limit = req.queary?.limit||5;

    const governorates = await Governorates.find({
       name:{ $regex:search,$options:"i"}
    }).limit(limit)

     const nights = await Night.find({
       name:{ $regex:search,$options:"i"}
    }).limit(limit)

    data = {governorates:governorates,nights:nights}
    res.status(200).json(
        data
  )
    } catch (error) {
        next(error)
    }
   
}


module.exports = search;