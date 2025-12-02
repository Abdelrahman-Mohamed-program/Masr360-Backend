const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const nightCtrl = require('../controllers/night.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

router.get('/', nightCtrl.getAll);
router.get('/:id', nightCtrl.getOne);

router.post('/',  [
  check('name', 'name required').notEmpty()
], nightCtrl.createNight);

router.put('/:id',  nightCtrl.updateNight);
router.delete('/:id',  nightCtrl.deleteNight);

module.exports = router;