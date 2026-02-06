const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const nightCtrl = require('../controllers/night.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const path = require("path")
const multer = require("multer")
//multer file upload
const storage = multer.diskStorage({
        destination:(req,file,cb)=>{//the destination of where the file will be saved in the server
            cb(null,path.join(__dirname,"../uploads/nights")) 
        },
        filename :(req,file,cb)=>{//the name that the file will be saved as in the destination
            cb(null,new Date().toISOString().replace(/:/g,"-")+"-"+file.originalname)//you can't save photos with the same name that's why we add the date to it
        }//there are some operating system that strugle with / that's why we use reguler exprestion to change it in the name
})


const upload = multer({
    storage,
})

router.get('/', nightCtrl.getAll);
router.get('/:id', nightCtrl.getOne);

router.post('/',upload.single('img')  ,[
  check('name', 'name required').notEmpty()
], nightCtrl.createNight);

router.put('/:id',  nightCtrl.updateNight);
router.delete('/:id',  nightCtrl.deleteNight);

module.exports = router;