const { Service, Artisan, Commande, Categorie } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Obtenir tous les services avec pagination et filtres
exports.getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, prixMin, prixMax, artisanId, categorieId } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (search) {
      whereClause.nom = { [Op.like]: `%${search}%` };
    }
    if (prixMin || prixMax) {
      whereClause.prixUnitaire = {};
      if (prixMin) whereClause.prixUnitaire[Op.gte] = parseFloat(prixMin);
      if (prixMax) whereClause.prixUnitaire[Op.lte] = parseFloat(prixMax);
    }
    if (artisanId) {
      whereClause.artisanId = artisanId;
    }
    if (categorieId) {
      whereClause.categorieId = categorieId;
    }

    const services = await Service.findAndCountAll({
      where: whereClause,
      include: [
        { model: Artisan, as: 'artisan' },
        { model: Categorie, as: 'categorie' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['prixUnitaire', 'ASC']]
    });

    res.json({
      services: services.rows,
      total: services.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(services.count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir un service par ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        { model: Artisan, as: 'artisan' },
        { model: Categorie, as: 'categorie' },
        { model: Commande, as: 'commandes' }
      ]
    });
    
    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un nouveau service
exports.createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour un service
exports.updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    
    await service.update(req.body);
    res.json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    
    await service.destroy();
    res.json({ message: 'Service supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les services par artisan
exports.getServicesByArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const services = await Service.findAll({
      where: { artisanId },
      include: [
        { model: Artisan, as: 'artisan' },
        { model: Categorie, as: 'categorie' }
      ]
    });
    
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les services populaires
exports.getPopularServices = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const services = await Service.findAll({
      include: [
        { model: Artisan, as: 'artisan' },
        { model: Categorie, as: 'categorie' },
        { model: Commande, as: 'commandes' }
      ],
      limit: parseInt(limit),
      order: [[{ model: Commande, as: 'commandes' }, 'id', 'DESC']]
    });
    
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 