const { validationResult } = require("express-validator");
const Favourite = require("../models/Favourites");
const Favourites = require("../models/Favourites");


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

// const getAll = async (req,res,next)=>{

// }

const getAll = async(req,res,next)=>{

    const user = req.user;
    let favourites ;

      if (user.role=="user") {
            favourites = await Favourites.find({
                user
            }).populate("targetId")
        }else{

        }
   

      if (!favourites) {
      return  res.status(404).json({
            message:"Not found"
        })
    }

    res.status(200).json(
        favourites
    )
}

const deleteOne = async (req,res,next)=>{
    try {
         const id = req.params.id;

       
    
       const fav = await Favourite.findById(id);
       if (!fav) {
        return res.status(404).json({
            message:"Not found"
        })
       }

       console.log(String(fav.user));
       

        if (req.user.role!="admin"&&String(req.user.id) != String(fav.user) ) {
        return res.status(403).json({
            message:"Forbidden"
        })
       }  
       res.status(200).json({
        message:"Deleted"
       })
    } catch (error) {
        next(error)
    }
}



const getOne = async (req,res,next)=>{
    try {
       const id = req.params.id;

       const fav = await Favourite.findById(id);

       if (!fav) {
        return res.status(404).json({
            message:"Not found"
        })
       }
       res.status(200).json(
        fav
       ) 
    } catch (error) {
        next(error)
    }
}



module.exports = {
    addOne,deleteOne,getAll,getOne
}