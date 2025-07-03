const { Categorie, Service } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Obtenir toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (search) {
      whereClause.nom = { [Op.like]: `%${search}%` };
    }

    const categories = await Categorie.findAndCountAll({
      where: whereClause,
      include: [
        { model: Service, as: 'services' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nom', 'ASC']]
    });

    res.json({
      success: true,
      data: categories.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: categories.count,
        totalPages: Math.ceil(categories.count / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir une catégorie par ID
exports.getCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id, {
      include: [
        { model: Service, as: 'services' }
      ]
    });
    
    if (!categorie) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    res.json({
      success: true,
      data: categorie
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une nouvelle catégorie
exports.createCategorie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const categorie = await Categorie.create(req.body);
    res.status(201).json({
      success: true,
      data: categorie
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour une catégorie
exports.updateCategorie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (!categorie) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    await categorie.update(req.body);
    res.json({
      success: true,
      data: categorie
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer une catégorie
exports.deleteCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (!categorie) {
      return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    
    // Vérifier s'il y a des services associés
    const servicesCount = await Service.count({ where: { categorieId: req.params.id } });
    if (servicesCount > 0) {
      return res.status(400).json({ 
        error: 'Impossible de supprimer cette catégorie car elle contient des services' 
      });
    }
    
    await categorie.destroy();
    res.json({ 
      success: true,
      message: 'Catégorie supprimée avec succès' 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les services d'une catégorie
exports.getServicesByCategorie = async (req, res) => {
  try {
    const { categorieId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const services = await Service.findAndCountAll({
      where: { categorieId },
      include: [
        { model: Categorie, as: 'categorie' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nom', 'ASC']]
    });
    
    res.json({
      success: true,
      data: services.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: services.count,
        totalPages: Math.ceil(services.count / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 