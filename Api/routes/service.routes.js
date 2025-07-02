const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/service.controller');
const { body, query } = require('express-validator');
const auth = require('../middlewares/auth');

// Validation pour la création/mise à jour de service
const serviceValidation = [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('prixUnitaire').isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('dureeEstimee').notEmpty().withMessage('La durée estimée est requise'),
  body('artisanId').isUUID().withMessage('ID artisan invalide'),
  body('categorieId').optional().isUUID().withMessage('ID catégorie invalide')
];

// Validation pour les filtres
const filterValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page invalide'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite invalide'),
  query('prixMin').optional().isFloat({ min: 0 }).withMessage('Prix minimum invalide'),
  query('prixMax').optional().isFloat({ min: 0 }).withMessage('Prix maximum invalide'),
  query('artisanId').optional().isUUID().withMessage('ID artisan invalide'),
  query('categorieId').optional().isUUID().withMessage('ID catégorie invalide')
];

// Routes publiques
router.get('/', filterValidation, ServiceController.getAllServices);
router.get('/:id', ServiceController.getServiceById);
router.get('/artisan/:artisanId', ServiceController.getServicesByArtisan);
router.get('/populaires', ServiceController.getPopularServices);

// Routes protégées (nécessitent authentification)
router.post('/', auth, serviceValidation, ServiceController.createService);
router.put('/:id', auth, serviceValidation, ServiceController.updateService);
router.delete('/:id', auth, ServiceController.deleteService);

module.exports = router; 