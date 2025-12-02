const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const placeCtrl = require('../controllers/place.controller');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

router.get('/', placeCtrl.getAll);
router.get('/:id', placeCtrl.getOne);

router.post('/'[
  check('name', 'name required').notEmpty(),
  check('government', 'government required').notEmpty()
], placeCtrl.createPlace);

router.put('/:id',placeCtrl.updatePlace);
router.delete('/:id', placeCtrl.deletePlace);

module.exports = router;