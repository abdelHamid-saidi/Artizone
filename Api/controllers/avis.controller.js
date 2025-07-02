const { Avis, Commande, Particulier, Artisan } = require('../models');
const { validationResult } = require('express-validator');

// Obtenir tous les avis avec pagination et filtres
exports.getAllAvis = async (req, res) => {
  try {
    const { page = 1, limit = 10, note, artisanId, commandeId } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (note) whereClause.note = note;
    if (artisanId) whereClause.artisanId = artisanId;
    if (commandeId) whereClause.commandeId = commandeId;

    const avis = await Avis.findAndCountAll({
      where: whereClause,
      include: [
        { model: Commande, as: 'commande' },
        { model: Particulier, as: 'particulier' },
        { model: Artisan, as: 'artisan' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']]
    });

    res.json({
      avis: avis.rows,
      total: avis.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(avis.count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir un avis par ID
exports.getAvisById = async (req, res) => {
  try {
    const avis = await Avis.findByPk(req.params.id, {
      include: [
        { model: Commande, as: 'commande' },
        { model: Particulier, as: 'particulier' },
        { model: Artisan, as: 'artisan' }
      ]
    });
    
    if (!avis) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }
    
    res.json(avis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un nouvel avis
exports.createAvis = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { commandeId, note, commentaire } = req.body;
    
    // Vérifier que la commande existe et est terminée
    const commande = await Commande.findByPk(commandeId, {
      include: [{ model: Artisan, as: 'artisan' }]
    });
    
    if (!commande) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    if (commande.statut !== 'terminée') {
      return res.status(400).json({ error: 'La commande doit être terminée pour laisser un avis' });
    }
    
    // Vérifier qu'un avis n'existe pas déjà pour cette commande
    const existingAvis = await Avis.findOne({ where: { commandeId } });
    if (existingAvis) {
      return res.status(400).json({ error: 'Un avis existe déjà pour cette commande' });
    }
    
    // Créer l'avis
    const avis = await Avis.create({
      commandeId,
      particulierId: commande.particulierId,
      artisanId: commande.artisanId,
      note,
      commentaire,
      date: new Date()
    });
    
    // Mettre à jour la note moyenne de l'artisan
    await updateArtisanRating(commande.artisanId);
    
    res.status(201).json(avis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour un avis
exports.updateAvis = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const avis = await Avis.findByPk(req.params.id);
    if (!avis) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }
    
    await avis.update(req.body);
    
    // Mettre à jour la note moyenne de l'artisan
    await updateArtisanRating(avis.artisanId);
    
    res.json(avis);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un avis
exports.deleteAvis = async (req, res) => {
  try {
    const avis = await Avis.findByPk(req.params.id);
    if (!avis) {
      return res.status(404).json({ error: 'Avis non trouvé' });
    }
    
    const artisanId = avis.artisanId;
    await avis.destroy();
    
    // Mettre à jour la note moyenne de l'artisan
    await updateArtisanRating(artisanId);
    
    res.json({ message: 'Avis supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les avis d'un artisan
exports.getAvisByArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const avis = await Avis.findAndCountAll({
      where: { artisanId },
      include: [
        { model: Particulier, as: 'particulier' },
        { model: Commande, as: 'commande' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']]
    });
    
    res.json({
      avis: avis.rows,
      total: avis.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(avis.count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les avis d'un particulier
exports.getAvisByParticulier = async (req, res) => {
  try {
    const { particulierId } = req.params;
    const avis = await Avis.findAll({
      where: { particulierId },
      include: [
        { model: Artisan, as: 'artisan' },
        { model: Commande, as: 'commande' }
      ],
      order: [['date', 'DESC']]
    });
    
    res.json(avis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les statistiques des avis d'un artisan
exports.getArtisanRatingStats = async (req, res) => {
  try {
    const { artisanId } = req.params;
    
    const avis = await Avis.findAll({
      where: { artisanId },
      attributes: ['note']
    });
    
    if (avis.length === 0) {
      return res.json({
        noteMoyenne: 0,
        totalAvis: 0,
        repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }
    
    const notes = avis.map(a => a.note);
    const noteMoyenne = notes.reduce((sum, note) => sum + note, 0) / notes.length;
    
    const repartition = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    notes.forEach(note => {
      repartition[note]++;
    });
    
    res.json({
      noteMoyenne: Math.round(noteMoyenne * 10) / 10,
      totalAvis: notes.length,
      repartition
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fonction utilitaire pour mettre à jour la note moyenne d'un artisan
async function updateArtisanRating(artisanId) {
  try {
    const avis = await Avis.findAll({
      where: { artisanId },
      attributes: ['note']
    });
    
    if (avis.length > 0) {
      const noteMoyenne = avis.reduce((sum, avis) => sum + avis.note, 0) / avis.length;
      await Artisan.update(
        { noteMoyenne: Math.round(noteMoyenne * 10) / 10 },
        { where: { id: artisanId } }
      );
    }
  } catch (err) {
    console.error('Erreur mise à jour note artisan:', err);
  }
} 