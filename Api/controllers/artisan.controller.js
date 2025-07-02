const { Artisan, Service, Disponibilite, AdresseArtisan, Avis } = require('../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Obtenir tous les artisans avec pagination et filtres
exports.getAllArtisans = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, noteMin, langue, ville } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (search) {
      whereClause.nom = { [Op.like]: `%${search}%` };
    }
    if (noteMin) {
      whereClause.noteMoyenne = { [Op.gte]: parseFloat(noteMin) };
    }
    if (langue) {
      whereClause.langue = langue;
    }
    if (ville) {
      whereClause.ville = { [Op.like]: `%${ville}%` };
    }

    const artisans = await Artisan.findAndCountAll({
      where: whereClause,
      include: [
        { model: AdresseArtisan, as: 'AdresseArtisans' },
        { model: Service, as: 'services' },
        { model: Disponibilite, as: 'disponibilites' },
        { model: Avis, as: 'avis' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['noteMoyenne', 'DESC']]
    });

    res.json({
      artisans: artisans.rows,
      total: artisans.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(artisans.count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir un artisan par ID
exports.getArtisanById = async (req, res) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id, {
      include: [
        { model: AdresseArtisan, as: 'AdresseArtisans' },
        { model: Service, as: 'services' },
        { model: Disponibilite, as: 'disponibilites' },
        { model: Avis, as: 'avis' }
      ]
    });
    
    if (!artisan) {
      return res.status(404).json({ error: 'Artisan non trouvé' });
    }
    
    res.json(artisan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un nouvel artisan
exports.createArtisan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const artisan = await Artisan.create(req.body);
    res.status(201).json(artisan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour un artisan
exports.updateArtisan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const artisan = await Artisan.findByPk(req.params.id);
    if (!artisan) {
      return res.status(404).json({ error: 'Artisan non trouvé' });
    }
    
    await artisan.update(req.body);
    res.json(artisan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un artisan
exports.deleteArtisan = async (req, res) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id);
    if (!artisan) {
      return res.status(404).json({ error: 'Artisan non trouvé' });
    }
    
    await artisan.destroy();
    res.json({ message: 'Artisan supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les artisans par service
exports.getArtisansByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const artisans = await Artisan.findAll({
      include: [
        {
          model: Service,
          as: 'services',
          where: { id: serviceId }
        },
        { model: AdresseArtisan, as: 'AdresseArtisans' },
        { model: Disponibilite, as: 'disponibilites' }
      ]
    });
    
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les artisans disponibles
exports.getAvailableArtisans = async (req, res) => {
  try {
    const { date, heureDebut, heureFin } = req.query;
    const artisans = await Artisan.findAll({
      include: [
        {
          model: Disponibilite,
          as: 'disponibilites',
          where: {
            isDisponible: true,
            heureDebut: { [Op.lte]: heureDebut },
            heureFin: { [Op.gte]: heureFin }
          }
        },
        { model: Service, as: 'services' }
      ]
    });
    
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 