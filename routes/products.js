const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const productCtrl = require('../controllers/product.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

router.get('/', productCtrl.getAll);
router.get('/:id', productCtrl.getOne);

router.post('/',  [
  check('name', 'name required').notEmpty()
], productCtrl.createProduct);

router.put('/:id',  productCtrl.updateProduct);
router.delete('/:id',  productCtrl.deleteProduct);

module.exports = router;