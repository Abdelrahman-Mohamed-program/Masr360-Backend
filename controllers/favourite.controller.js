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
  let filter = {}; 
    let type = req.query.type||"ALL";
   
if (type !== "ALL") {
type = type[0].toUpperCase()+type.slice(1);
  filter.type = type;
}
console.log(filter.type);

      if (user.role=="user") {
        filter.user = req.user._id;
            favourites = await Favourites.find(
                filter
        ).populate("targetId")
        }else{
     favourites = await Favourites.aggregate([

  // 1️⃣ Optional filter
  {
    $match: filter
  },

  // 2️⃣ Group by targetId
  {
    $group: {
      _id: "$targetId",
      users: { $addToSet: "$user" }, // avoid duplicate users
      count: { $sum: 1 }
    }
  },

  // 3️⃣ Lookup target details
  {
    $lookup: {
      from: "type", 
      localField: "_id",
      foreignField: "_id",
      as: "target"
    }
  },

  { $unwind: "$target" },

  // 4️⃣ Lookup users to get usernames
  {
    $lookup: {
      from: "users",
      localField: "users",
      foreignField: "_id",
      as: "usersData"
    }
  },

  // 5️⃣ Project final shape
  {
    $project: {
      _id: 0,
      target: 1,
      count: 1,
      users: {
        $map: {
          input: "$usersData",
          as: "u",
          in: {
            _id: "$$u._id",
            username: "$$u.username"
          }
        }
      }
    }
  }

]);
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