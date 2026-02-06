const express = require('express');
const router = express.Router();

const categoryCntrl = require('../controllers/category.controller');
const validateId = require('../middlewares/validateId');





router.get('/', categoryCntrl.getAll);
router.get('/:id', validateId,categoryCntrl.getOne);
router.put('/:id', validateId,categoryCntrl.updateOne);
router.post('/', categoryCntrl.addOne);
router.delete('/:id', validateId,categoryCntrl.destroy);
module.exports = router;