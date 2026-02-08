const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const productCtrl = require('../controllers/product.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const validateId = require('../middlewares/validateId');
const upload = require("../middlewares/upload");
const multiapleUploads = require('../middlewares/multiapleUploads');


router.get('/', productCtrl.getAll);
router.get('/:id',validateId,productCtrl.getOne);

router.post('/',  upload.array('imgs',5),multiapleUploads,[
  check('name', 'name required').notEmpty(),
   check('desc', 'desc required').notEmpty(),
      check('price', 'price required').notEmpty(),
         check('quantity', 'quantity required').notEmpty(),
           check('category', 'category required').notEmpty(),
                check('lang', 'lang required').notEmpty()   
], productCtrl.createProduct);

router.put('/:id', validateId, productCtrl.updateProduct);
router.delete('/:id',validateId,  productCtrl.deleteProduct);

module.exports = router;
