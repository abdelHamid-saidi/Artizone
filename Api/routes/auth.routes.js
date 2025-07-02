const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { body } = require('express-validator');

// Inscription particulier
router.post('/register', [
  body('email').isEmail(),
  body('motDePasse').isLength({ min: 6 })
], AuthController.register);

// Connexion particulier/admin
router.post('/login', [
  body('email').isEmail(),
  body('motDePasse').exists()
], AuthController.login);

module.exports = router; 