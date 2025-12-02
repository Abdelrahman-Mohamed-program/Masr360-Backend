const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const reviewCtrl = require('../controllers/review.controller');
const { authMiddleware } = require('../middlewares/auth');

// anyone can read
router.get('/', reviewCtrl.getAll);
router.get('/:id', reviewCtrl.getOne);

// create review (user must be logged in)
router.post('/',  [
  check('username','username required').notEmpty(),
  check('rate','rate 0-5').isFloat({ min: 0, max: 5 }),
  check('type','type required').notEmpty(),
  check('type_id','type_id required').notEmpty()
], reviewCtrl.createReview);

// delete (author or admin)
router.delete('/:id', authMiddleware, reviewCtrl.deleteReview);

module.exports = router;