const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const productCtrl = require('../controllers/product.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const validateId = require('../middlewares/validateId');
const upload = require("../middlewares/upload");
const multiapleUploads = require('../middlewares/multiapleUploads');
const { isValidObjectId } = require('mongoose');
const Category = require('../models/Category');


router.get('/', productCtrl.getAll);
router.get('/:id',validateId,productCtrl.getOne);

router.post('/', upload.array('imgs',5),
  body('name', 'name required').notEmpty().isString(),
   body('desc', 'desc required').notEmpty().isString(),
      body('price', 'price required').notEmpty().isInt({min:0,max:10000000}).withMessage("invalid value for price").toInt(),
      body('discount').optional().isInt({min:0,max:100}).withMessage("discount percentage must be in rang from 0 to 100").toInt(),
      body('quantity','Invalid value for quantitiy').notEmpty().isInt({min:0,max:10000}).withMessage("quantity must be in rang from 0 to 10000").toInt(),
      body('translations','Invalid value for translations').customSanitizer(val=>{
                  try {
                    return JSON.parse(val)
                  } catch (error) {
                    throw new Error('Invalid value for translations')
                  }
                }).customSanitizer((val) => {
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
                    if (!cat||cat.type!="product") {
                         throw new Error("Invalid category id")
                    }
                    return true;
                  }
                 ),multiapleUploads,
 productCtrl.createProduct);

router.put('/:id', validateId, upload.array('imgs',5),multiapleUploads,productCtrl.updateProduct);
router.delete('/:id',validateId,  productCtrl.deleteProduct);

module.exports = router;
