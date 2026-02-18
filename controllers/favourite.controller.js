const { validationResult } = require("express-validator");
const Favourite = require("../models/Favourites")

const addOne = async (req,res,next)=>{
    try {
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
        const user = req.user.id;

       let fav = new Favourite({...req.body,user});

        await fav.save();
        res.status(201).json({
            fav
        })
    } catch (error) {
        next(error)
    }
}




module.exports = {
    addOne
}