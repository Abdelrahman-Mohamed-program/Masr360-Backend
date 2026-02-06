
const express = require('express');
const router = express.Router();

const allCntrl = require('../controllers/all.controller');


router.get("/",allCntrl)
module.exports = router;