const router = require("express").Router();
const {authMiddleware,adminOnly} = require("../middlewares/auth");
const validation = require("../middlewares/checkValidation");
const validateId = require("../middlewares/validateId");
const Product = require("../models/Product");
const { body } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const Place = require("../models/Place")
const Night = require("../models/Night");
const { addOne,deleteOne,getAll,getOne } = require("../controllers/favourite.controller");


const obj  = {
    Product:Product,
    Place:Place,
    Night:Night
}


router.post("/",authMiddleware,
  body("targetId")
    .notEmpty().withMessage("targetId cannot be empty")
    .custom(async (value,{req}) => {
      if (!isValidObjectId(value)) {
        throw new Error("Invalid targetId: not a valid ObjectId");
      }

      let type = req.body.type[0].toUpperCase() + req.body.type.slice(1).toLowerCase(); 

      
      if (!obj[type]) {
        throw new Error("Invalid target type");
      }

     
      const fav = await obj[type].findById(value);
      if (!fav) {
        throw new Error("Target not found");
      }
       req.body.type = type
    })
,addOne);


router.delete("/:id",authMiddleware,validation,validateId,deleteOne);
router.get("/",authMiddleware,validation,getAll);
router.get("/:id",authMiddleware,getOne);


module.exports = router;