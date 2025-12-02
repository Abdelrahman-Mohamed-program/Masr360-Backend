const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

// admin-only
router.get('/', userCtrl.getAll);
router.get('/:id', userCtrl.getOne);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);

module.exports = router