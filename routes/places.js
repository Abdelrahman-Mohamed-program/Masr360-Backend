const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const placeCtrl = require('../controllers/place.controller');
const multer =  require("multer")
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const path = require("path")
const storage = multer.diskStorage({
        destination:(req,file,cb)=>{//the destination of where the file will be saved in the server
            cb(null,path.join(__dirname,"../uploads/places")) 
        },
        filename :(req,file,cb)=>{//the name that the file will be saved as in the destination
            cb(null,new Date().toISOString().replace(/:/g,"-")+"-"+file.originalname)//you can't save photos with the same name that's why we add the date to it
        }//there are some operating system that strugle with / that's why we use reguler exprestion to change it in the name
})

const upload = multer({
    storage,
})


router.get('/', placeCtrl.getAll);
router.get('/:id', placeCtrl.getOne);

router.post('/',upload.array('imgs',20), placeCtrl.createPlace);

router.put('/:id',placeCtrl.updatePlace);
router.delete('/:id', placeCtrl.deletePlace);

module.exports = router;