const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const govCtrl = require('../controllers/governorate.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const path = require("path")
const multer = require("multer");
const validateId = require('../middlewares/validateId');
const cloudinary = require("cloudinary").v2;



const storage = multer.memoryStorage();

const upload = multer({ storage });


router.get('/', govCtrl.getAll);
router.get('/:id',validateId, govCtrl.getOne);

router.post('/',
upload.single('img'), 
[
  check('name', 'name field required').notEmpty(),
 check('desc', 'description field required').notEmpty(),
  check('desc', 'description field required').notEmpty(),
  check('translations', 'translations Object is required required').notEmpty(),
   ,
],govCtrl.createGov);

router.put('/:id',validateId,upload.single('img'), govCtrl.updateGov);
router.delete('/:id',validateId,govCtrl.deleteGov);

module.exports = router;