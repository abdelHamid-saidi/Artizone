const express = require('express');
const router = express.Router();
const DisponibiliteController = require('../controllers/disponibilite.controller');
const { body, query } = require('express-validator');
const auth = require('../middlewares/auth');

// Validation pour la création/mise à jour de disponibilité
const disponibiliteValidation = [
  body('jour').isIn(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']).withMessage('Jour invalide'),
  body('heureDebut').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Heure de début invalide'),
  body('heureFin').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Heure de fin invalide'),
  body('isDisponible').isBoolean().withMessage('Disponibilité invalide'),
  body('artisanId').isUUID().withMessage('ID artisan invalide')
];

// Validation pour les filtres
const filterValidation = [
  query('artisanId').optional().isUUID().withMessage('ID artisan invalide'),
  query('jour').optional().isIn(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']).withMessage('Jour invalide'),
  query('isDisponible').optional().isBoolean().withMessage('Disponibilité invalide')
];

// Routes publiques
router.get('/', filterValidation, DisponibiliteController.getAllDisponibilites);
router.get('/:id', DisponibiliteController.getDisponibiliteById);
router.get('/artisan/:artisanId', DisponibiliteController.getDisponibilitesByArtisan);

// Routes protégées (nécessitent authentification)
router.post('/', auth, disponibiliteValidation, DisponibiliteController.createDisponibilite);
router.put('/:id', auth, disponibiliteValidation, DisponibiliteController.updateDisponibilite);
router.delete('/:id', auth, DisponibiliteController.deleteDisponibilite);
router.put('/artisan/:artisanId', auth, DisponibiliteController.updateArtisanDisponibilite);

module.exports = router; 