const express = require('express');
const router = express.Router();

const categoryCntrl = require('../controllers/category.controller');





router.get('/', categoryCntrl.getAll);


module.exports = router;