const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');

// ===== VALIDATION SCHEMAS =====

// Validation pour l'inscription/connexion particulier
const particulierValidation = [
  body('email').isEmail().withMessage('Adresse email invalide'),
  body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Validation pour l'inscription particulier
const registerParticulierValidation = [
  ...particulierValidation,
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('telephone').optional().isMobilePhone('fr-FR').withMessage('Numéro de téléphone invalide')
];

// Validation pour l'inscription/connexion administrateur
const adminValidation = [
  body('email').isEmail().withMessage('Adresse email invalide'),
  body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Validation pour l'inscription administrateur
const registerAdminValidation = [
  ...adminValidation,
  body('nom').notEmpty().withMessage('Le nom est requis')
];

// ===== ROUTES PARTICULIER =====

// Inscription particulier
router.post('/particulier/register', registerParticulierValidation, AuthController.registerParticulier);

// Connexion particulier
router.post('/particulier/login', particulierValidation, AuthController.loginParticulier);

// ===== ROUTES ADMINISTRATEUR =====

// Inscription administrateur
router.post('/admin/register', registerAdminValidation, AuthController.registerAdmin);

// Connexion administrateur
router.post('/admin/login', adminValidation, AuthController.loginAdmin);

// ===== ROUTES LEGACY (pour compatibilité) =====

// Inscription (redirige vers particulier par défaut)
router.post('/register', registerParticulierValidation, AuthController.register);

// Connexion mixte (recherche dans les deux tables)
router.post('/login', particulierValidation, AuthController.login);

// ===== ROUTES UTILITAIRES =====

// Vérifier le token (nécessite authentification)
router.get('/verify', auth(), AuthController.verifyToken);

// Déconnexion (symbolique avec JWT)
router.post('/logout', auth(), AuthController.logout);

module.exports = router; 