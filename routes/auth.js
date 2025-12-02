
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');

// register
router.post('/register', [
  check('username', 'username is required').notEmpty(),
  check('password', 'password min 6 chars').isLength({ min: 6 })
], authController.register);

// login
router.post('/login', [
  check('username', 'username is required').notEmpty(),
  check('password', 'password required').notEmpty()
], authController.login);

module.exports = router;