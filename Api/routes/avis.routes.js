const express = require('express');
const router = express.Router();
const AvisController = require('../controllers/avis.controller');
const { body, query } = require('express-validator');
const auth = require('../middlewares/auth');

// Validation pour la création/mise à jour d'avis
const avisValidation = [
  body('commandeId').isUUID().withMessage('ID commande invalide'),
  body('note').isInt({ min: 1, max: 5 }).withMessage('Note invalide (1-5)'),
  body('commentaire').optional().isString().isLength({ max: 500 }).withMessage('Commentaire trop long')
];

// Validation pour les filtres
const filterValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page invalide'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite invalide'),
  query('note').optional().isInt({ min: 1, max: 5 }).withMessage('Note invalide'),
  query('artisanId').optional().isUUID().withMessage('ID artisan invalide'),
  query('commandeId').optional().isUUID().withMessage('ID commande invalide')
];

// Routes publiques
router.get('/', filterValidation, AvisController.getAllAvis);
router.get('/:id', AvisController.getAvisById);
router.get('/artisan/:artisanId', AvisController.getAvisByArtisan);
router.get('/artisan/:artisanId/stats', AvisController.getArtisanRatingStats);

// Routes protégées (nécessitent authentification)
router.get('/particulier/:particulierId', auth, AvisController.getAvisByParticulier);
router.post('/', auth, avisValidation, AvisController.createAvis);
router.put('/:id', auth, avisValidation, AvisController.updateAvis);
router.delete('/:id', auth, AvisController.deleteAvis);

module.exports = router; 