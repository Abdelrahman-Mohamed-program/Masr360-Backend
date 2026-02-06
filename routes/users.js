const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');
const validateId = require('../middlewares/validateId');

// admin-only
router.get('/', userCtrl.getAll);
router.get('/:id',validateId, userCtrl.getOne);
router.put('/:id',validateId, userCtrl.updateUser);
router.delete('/:id',validateId, userCtrl.deleteUser);

module.exports = router
