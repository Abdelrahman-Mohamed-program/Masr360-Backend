const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const reviewCtrl = require('../controllers/review.controller');
const { authMiddleware } = require('../middlewares/auth');
const validateId = require('../middlewares/validateId');

// anyone can read

router.use(authMiddleware)
router.get('/', reviewCtrl.getAll);
router.get('/:id',validateId, reviewCtrl.getOne);

router.put("/:id",reviewCtrl.updateOne);
router.post('/', [
  // check('user','user id required').notEmpty(),
  check('rate','rate 0-5').isFloat({ min: 0, max: 5 }),
  check('type','type required').notEmpty(),
  check('targetId','type_id required').notEmpty(),
  check('lang','lang required').notEmpty(),
  check('desc','desc required').notEmpty()
], reviewCtrl.createReview);

// delete (author or admin)
router.delete('/:id',validateId, reviewCtrl.deleteReview);

module.exports = router;