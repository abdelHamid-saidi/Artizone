const express = require('express');
const router = express.Router();
const CategorieController = require('../controllers/categorie.controller');
const { body, query } = require('express-validator');
const auth = require('../middlewares/auth');

// Validation pour la création/mise à jour de catégorie
const categorieValidation = [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('description').optional().isString().withMessage('La description doit être une chaîne'),
  body('icone').optional().isString().withMessage('L\'icône doit être une chaîne'),
  body('couleur').optional().isString().withMessage('La couleur doit être une chaîne')
];

// Validation pour les filtres
const filterValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page invalide'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite invalide'),
  query('search').optional().isString().withMessage('Recherche invalide')
];

// Routes publiques
router.get('/', filterValidation, CategorieController.getAllCategories);
router.get('/:id', CategorieController.getCategorieById);
router.get('/:categorieId/services', CategorieController.getServicesByCategorie);

// Routes protégées (nécessitent authentification)
router.post('/', auth, categorieValidation, CategorieController.createCategorie);
router.put('/:id', auth, categorieValidation, CategorieController.updateCategorie);
router.delete('/:id', auth, CategorieController.deleteCategorie);

module.exports = router; 