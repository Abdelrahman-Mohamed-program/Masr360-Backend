const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const govCtrl = require('../controllers/government.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

router.get('/', govCtrl.getAll);
router.get('/:id', govCtrl.getOne);

router.post('/',  [
  check('name', 'name required').notEmpty()
], govCtrl.createGov);

router.put('/:id', govCtrl.updateGov);
router.delete('/:id',govCtrl.deleteGov);

module.exports = router;