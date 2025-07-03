const express = require('express');
const router = express.Router();
const ArtisanController = require('../controllers/artisan.controller');
const { body, query } = require('express-validator');
const auth = require('../middlewares/auth');

// Validation pour la création/mise à jour d'artisan
const artisanValidation = [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('telephone').notEmpty().withMessage('Le téléphone est requis'),
  body('langue').isIn(['fr', 'en', 'es']).withMessage('Langue invalide'),
  body('noteMoyenne').optional().isFloat({ min: 0, max: 5 }).withMessage('Note invalide'),
  body('ville').optional().isString().withMessage('Ville invalide'),
  body('pays').optional().isString().withMessage('Pays invalide')
];

// Validation pour les filtres
const filterValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page invalide'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite invalide'),
  query('search').optional().isString().withMessage('Recherche invalide'),
  query('categorieId').optional().isUUID().withMessage('ID de catégorie invalide'),
  query('noteMin').optional().isFloat({ min: 0, max: 5 }).withMessage('Note minimale invalide'),
  query('langue').optional().isIn(['fr', 'en', 'es']).withMessage('Langue invalide'),
  query('ville').optional().isString().withMessage('Ville invalide')
];

// Routes publiques
router.get('/', filterValidation, ArtisanController.getAllArtisans);
router.get('/:id', ArtisanController.getArtisanById);
router.get('/service/:serviceId', ArtisanController.getArtisansByService);
router.get('/disponibles', ArtisanController.getAvailableArtisans);

// Routes protégées (nécessitent authentification)
router.post('/', auth, artisanValidation, ArtisanController.createArtisan);
router.put('/:id', auth, artisanValidation, ArtisanController.updateArtisan);
router.delete('/:id', auth, ArtisanController.deleteArtisan);

module.exports = router; 