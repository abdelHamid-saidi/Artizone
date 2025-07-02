const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');
const { query } = require('express-validator');
const auth = require('../middlewares/auth');

// Validation pour les paramètres de période
const periodeValidation = [
  query('periode').optional().isInt({ min: 1, max: 365 }).withMessage('Période invalide (1-365 jours)')
];

// Routes protégées (nécessitent authentification admin)
router.get('/stats/general', auth(['admin']), DashboardController.getGeneralStats);
router.get('/stats/commandes', auth(['admin']), periodeValidation, DashboardController.getCommandeStats);
router.get('/stats/paiements', auth(['admin']), periodeValidation, DashboardController.getPaiementStats);
router.get('/stats/avis', auth(['admin']), periodeValidation, DashboardController.getAvisStats);
router.get('/stats/services', auth(['admin']), DashboardController.getServiceStats);

module.exports = router; 