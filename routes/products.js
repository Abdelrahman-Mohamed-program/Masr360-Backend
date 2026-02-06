const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const productCtrl = require('../controllers/product.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const validateId = require('../middlewares/validateId');

router.get('/', productCtrl.getAll);
router.get('/:id',validateId,productCtrl.getOne);

router.post('/',  [
  check('name', 'name required').notEmpty()
], productCtrl.createProduct);

router.put('/:id', validateId, productCtrl.updateProduct);
router.delete('/:id',validateId,  productCtrl.deleteProduct);

module.exports = router;
