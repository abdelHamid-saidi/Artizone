const express = require('express');
const router = express.Router();
const CommandeController = require('../controllers/commande.controller');
const { body, query } = require('express-validator');
const auth = require('../middlewares/auth');

// Validation pour la création/mise à jour de commande
const commandeValidation = [
  body('serviceId').isUUID().withMessage('ID service invalide'),
  body('disponibiliteId').isUUID().withMessage('ID disponibilité invalide'),
  body('adresseParticulierId').isUUID().withMessage('ID adresse invalide'),
  body('description').optional().isString().withMessage('Description invalide')
];

// Validation pour les filtres
const filterValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page invalide'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite invalide'),
  query('statut').optional().isIn(['en_attente_paiement', 'payée', 'en_cours', 'terminée', 'annulée', 'refusée']).withMessage('Statut invalide'),
  query('particulierId').optional().isUUID().withMessage('ID particulier invalide'),
  query('artisanId').optional().isUUID().withMessage('ID artisan invalide')
];

// Validation pour le changement de statut
const statusValidation = [
  body('statut').isIn(['en_attente_paiement', 'payée', 'en_cours', 'terminée', 'annulée', 'refusée']).withMessage('Statut invalide')
];

// Routes publiques (avec authentification)
router.get('/', auth, filterValidation, CommandeController.getAllCommandes);
router.get('/:id', auth, CommandeController.getCommandeById);
router.get('/particulier/:particulierId', auth, CommandeController.getCommandesByParticulier);
router.get('/artisan/:artisanId', auth, CommandeController.getCommandesByArtisan);

// Routes protégées (nécessitent authentification)
router.post('/', auth, commandeValidation, CommandeController.createCommande);
router.put('/:id', auth, commandeValidation, CommandeController.updateCommande);
router.delete('/:id', auth, CommandeController.deleteCommande);
router.patch('/:id/statut', auth, statusValidation, CommandeController.updateCommandeStatus);

module.exports = router; 