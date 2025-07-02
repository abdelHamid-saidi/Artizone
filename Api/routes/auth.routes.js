const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');

// ===== VALIDATION SCHEMAS =====

// Validation personnalisée pour les numéros de téléphone français
const validateFrenchPhone = (value) => {
  if (!value) return true; // Optionnel
  
  // Supprimer les espaces, tirets et points
  const cleaned = value.replace(/[\s\-\.]/g, '');
  
  // Formats acceptés :
  // - +33XXXXXXXXX (format international)
  // - 0033XXXXXXXXX (format international avec 00)
  // - 0XXXXXXXXX (format national)
  // - 33XXXXXXXXX (format international sans +)
  
  const phoneRegex = /^(?:(?:\+|00)33|0|33)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  
  if (!phoneRegex.test(value)) {
    throw new Error('Format de numéro de téléphone invalide');
  }
  
  // Vérification de la longueur après nettoyage
  const digitsOnly = cleaned.replace(/\D/g, '');
  
  // Pour un numéro français :
  // - Avec indicatif pays (33) : 11 chiffres (33 + 9 chiffres)
  // - Sans indicatif pays : 10 chiffres (0 + 9 chiffres)
  if (digitsOnly.length === 10) {
    // Format 0XXXXXXXXX
    if (!digitsOnly.startsWith('0')) {
      throw new Error('Numéro de téléphone français invalide');
    }
  } else if (digitsOnly.length === 11) {
    // Format 33XXXXXXXXX ou +33XXXXXXXXX
    if (!digitsOnly.startsWith('33')) {
      throw new Error('Numéro de téléphone français invalide');
    }
  } else if (digitsOnly.length === 12) {
    // Format 0033XXXXXXXXX
    if (!digitsOnly.startsWith('0033')) {
      throw new Error('Numéro de téléphone français invalide');
    }
  } else {
    throw new Error('Longueur de numéro de téléphone invalide');
  }
  
  return true;
};

// Validation pour l'inscription/connexion particulier
const particulierValidation = [
  body('email').isEmail().withMessage('Adresse email invalide'),
  body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];

// Validation pour l'inscription particulier
const registerParticulierValidation = [
  ...particulierValidation,
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('telephone').optional().custom(validateFrenchPhone)
];

// Validation pour la mise à jour du profil
const updateProfileValidation = [
  body('nom').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('email').optional().isEmail().withMessage('Adresse email invalide'),
  body('telephone').optional().custom(validateFrenchPhone)
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

// ===== ROUTES PROFIL =====

// Récupérer le profil utilisateur (nécessite authentification)
router.get('/profile', auth(), AuthController.getProfile);

// Mettre à jour le profil utilisateur (nécessite authentification)
router.put('/profile', auth(), updateProfileValidation, AuthController.updateProfile);

// Changer le mot de passe (nécessite authentification)
router.put('/profile/password', auth(), [
  body('ancienMotDePasse').notEmpty().withMessage('L\'ancien mot de passe est requis'),
  body('nouveauMotDePasse').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
], AuthController.changePassword);

module.exports = router; 