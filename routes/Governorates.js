const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const govCtrl = require('../controllers/governorate.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const path = require("path")
const multer = require("multer");
const validateId = require('../middlewares/validateId');
//multer file upload
const storage = multer.diskStorage({
        destination:(req,file,cb)=>{//the destination of where the file will be saved in the server
            cb(null,path.join(__dirname,"../uploads/governorates")) 
        },
        filename :(req,file,cb)=>{//the name that the file will be saved as in the destination
            cb(null,new Date().toISOString().replace(/:/g,"-")+"-"+file.originalname)//you can't save photos with the same name that's why we add the date to it
        }//there are some operating system that strugle with / that's why we use reguler exprestion to change it in the name
})


const upload = multer({
    storage,
})

router.get('/', govCtrl.getAll);
router.get('/:id',validateId, govCtrl.getOne);

router.post('/',upload.single('img'), [
  check('name', 'name field required').notEmpty(),
//   check('img', 'img field required').notEmpty()
], govCtrl.createGov);

router.put('/:id',validateId,upload.single('img'), govCtrl.updateGov);
router.delete('/:id',validateId,govCtrl.deleteGov);

module.exports = router;