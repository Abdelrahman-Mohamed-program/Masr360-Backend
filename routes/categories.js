const express = require('express');
const router = express.Router();

const categoryCntrl = require('../controllers/category.controller');





router.get('/', categoryCntrl.getAll);
router.get('/:id', categoryCntrl.getOne);
router.put('/:id', categoryCntrl.updateOne);
router.post('/', categoryCntrl.addOne);
router.delete('/:id', categoryCntrl.destroy);
module.exports = router;