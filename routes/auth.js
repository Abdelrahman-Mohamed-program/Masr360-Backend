
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const {sendOtp, validateOtp} = require("../controllers/verfiy.controller")
// register
router.post('/register', [
  check('username', 'username is required').notEmpty(),
    check('email', 'email is required').notEmpty(),
  check('password', 'password min 6 chars').notEmpty().isLength({ min: 6 }),
  check('phoneNumber', 'phoneNumber must contain min 6 numbers').notEmpty().isLength({ min: 6 }).isNumeric(),
  check('location','location is required').notEmpty(),
  check('verfied', 'Cannot set verfication right now').isEmpty()
], authController.register);

router.post('/verify',sendOtp)
// login
router.post('/login', [
  check('email', 'email is required').notEmpty(),
  check('password', 'password required').notEmpty()
], authController.login);

router.post('/validateOtp',validateOtp);
router.post('/refresh',authController.refresh);
module.exports = router;