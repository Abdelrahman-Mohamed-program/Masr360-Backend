const express = require('express');
const router = express.Router();
 const body= require('express-validator').body;
const nightCtrl = require('../controllers/night.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const path = require("path")
const upload = require("../middlewares/upload")
const validateId = require('../middlewares/validateId');
const multiUploads = require("../middlewares/multiapleUploads");
const { json } = require('stream/consumers');
const Category = require("../models/Category")
const { isValidObjectId } = require('mongoose');
//multer file upload
// const storage = multer.diskStorage({
//         destination:(req,file,cb)=>{//the destination of where the file will be saved in the server
//             cb(null,path.join(__dirname,"../uploads/nights")) 
//         },
//         filename :(req,file,cb)=>{//the name that the file will be saved as in the destination
//             cb(null,new Date().toISOString().replace(/:/g,"-")+"-"+file.originalname)//you can't save photos with the same name that's why we add the date to it
//         }//there are some operating system that strugle with / that's why we use reguler exprestion to change it in the name
// })



router.get('/', nightCtrl.getAll);
router.get('/:id', validateId,nightCtrl.getOne);

router.post('/',
  upload.array('imgs',5),
body('name').notEmpty().withMessage('name is required').isString(),
body('desc').notEmpty().withMessage('desc is required').isString(),
body('location','invalid location value').isURL().notEmpty(),
body('locationIframe','invalid locationIframe value').isURL().notEmpty(),
body('translations','Invalid value for translations').customSanitizer(val=>{
  try {
    return JSON.parse(val)
  } catch (error) {
    throw new Error('Invalid value for translations')
  }
}) .customSanitizer((val) => {
    if (typeof val !== 'object' || val === null) 
      throw new Error('Invalid value for translations')

    const newObj = {};

    Object.keys(val).forEach((key) => {
      newObj[key.toUpperCase()] = val[key];
    });

    return newObj;
  }),
 body('category').notEmpty().custom(
 async val =>{ 
    if (!isValidObjectId(val)) {
      throw new Error("Invalid category id")
    }
    const cat = await Category.findById(val);
    if (!cat||cat.type!="night") {
         throw new Error("Invalid category id")
    }
    return true;
  }
 ),
  body('governorate').notEmpty().custom(
  val=>{
    if (!isValidObjectId(val)) {
      throw new Error("Invalid governorate id")
    }
    return true;
  }
 )
,multiUploads 
,nightCtrl.createNight);

router.put('/:id', validateId,upload.array('imgs',5),multiUploads , nightCtrl.updateNight);
router.delete('/:id', validateId, nightCtrl.deleteNight);

module.exports = router;