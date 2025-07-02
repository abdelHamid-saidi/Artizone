const { Disponibilite, Artisan } = require('../models');
const { validationResult } = require('express-validator');

// Obtenir toutes les disponibilités avec filtres
exports.getAllDisponibilites = async (req, res) => {
  try {
    const { artisanId, jour, isDisponible } = req.query;
    
    const whereClause = {};
    if (artisanId) whereClause.artisanId = artisanId;
    if (jour) whereClause.jour = jour;
    if (isDisponible !== undefined) whereClause.isDisponible = isDisponible === 'true';

    const disponibilites = await Disponibilite.findAll({
      where: whereClause,
      include: [
        { model: Artisan, as: 'artisan' }
      ],
      order: [['jour', 'ASC'], ['heureDebut', 'ASC']]
    });

    res.json(disponibilites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir une disponibilité par ID
exports.getDisponibiliteById = async (req, res) => {
  try {
    const disponibilite = await Disponibilite.findByPk(req.params.id, {
      include: [
        { model: Artisan, as: 'artisan' }
      ]
    });
    
    if (!disponibilite) {
      return res.status(404).json({ error: 'Disponibilité non trouvée' });
    }
    
    res.json(disponibilite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une nouvelle disponibilité
exports.createDisponibilite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const disponibilite = await Disponibilite.create(req.body);
    res.status(201).json(disponibilite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour une disponibilité
exports.updateDisponibilite = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const disponibilite = await Disponibilite.findByPk(req.params.id);
    if (!disponibilite) {
      return res.status(404).json({ error: 'Disponibilité non trouvée' });
    }
    
    await disponibilite.update(req.body);
    res.json(disponibilite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer une disponibilité
exports.deleteDisponibilite = async (req, res) => {
  try {
    const disponibilite = await Disponibilite.findByPk(req.params.id);
    if (!disponibilite) {
      return res.status(404).json({ error: 'Disponibilité non trouvée' });
    }
    
    await disponibilite.destroy();
    res.json({ message: 'Disponibilité supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les disponibilités d'un artisan
exports.getDisponibilitesByArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const disponibilites = await Disponibilite.findAll({
      where: { artisanId },
      order: [['jour', 'ASC'], ['heureDebut', 'ASC']]
    });
    
    res.json(disponibilites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour la disponibilité d'un artisan
exports.updateArtisanDisponibilite = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { disponibilites } = req.body;
    
    // Supprimer les anciennes disponibilités
    await Disponibilite.destroy({ where: { artisanId } });
    
    // Créer les nouvelles disponibilités
    const newDisponibilites = disponibilites.map(d => ({
      ...d,
      artisanId
    }));
    
    const createdDisponibilites = await Disponibilite.bulkCreate(newDisponibilites);
    
    res.json(createdDisponibilites);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 