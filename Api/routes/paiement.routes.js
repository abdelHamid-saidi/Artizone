const express = require('express');
const router = express.Router();
const PaiementController = require('../controllers/paiement.controller');
const { body, query } = require('express-validator');
const auth = require('../middlewares/auth');

// Validation pour la création/mise à jour de paiement
const paiementValidation = [
  body('commandeId').isUUID().withMessage('ID commande invalide'),
  body('methode').isIn(['carte', 'paypal', 'virement']).withMessage('Méthode de paiement invalide'),
  body('montant').isFloat({ min: 0 }).withMessage('Montant invalide')
];

// Validation pour les filtres
const filterValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page invalide'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite invalide'),
  query('statut').optional().isIn(['en_attente', 'payé', 'refusé', 'remboursé']).withMessage('Statut invalide'),
  query('commandeId').optional().isUUID().withMessage('ID commande invalide')
];

// Validation pour le traitement de paiement
const processValidation = [
  body('token').notEmpty().withMessage('Token de paiement requis')
];

// Routes publiques (avec authentification)
router.get('/', auth, filterValidation, PaiementController.getAllPaiements);
router.get('/:id', auth, PaiementController.getPaiementById);
router.get('/commande/:commandeId', auth, PaiementController.getPaiementsByCommande);

// Routes protégées (nécessitent authentification)
router.post('/', auth, paiementValidation, PaiementController.createPaiement);
router.post('/:paiementId/process', auth, processValidation, PaiementController.processPaiement);
router.put('/:id', auth, paiementValidation, PaiementController.updatePaiement);
router.delete('/:id', auth, PaiementController.deletePaiement);
router.post('/:paiementId/refund', auth, PaiementController.refundPaiement);

module.exports = router; 