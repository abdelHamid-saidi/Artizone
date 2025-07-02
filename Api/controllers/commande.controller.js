const { Commande, Particulier, Artisan, Service, Disponibilite, AdresseParticulier, Paiement, Avis } = require('../models');
const { validationResult } = require('express-validator');

// Obtenir toutes les commandes avec pagination et filtres
exports.getAllCommandes = async (req, res) => {
  try {
    const { page = 1, limit = 10, statut, particulierId, artisanId } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (statut) whereClause.statut = statut;
    if (particulierId) whereClause.particulierId = particulierId;
    if (artisanId) whereClause.artisanId = artisanId;

    const commandes = await Commande.findAndCountAll({
      where: whereClause,
      include: [
        { model: Particulier, as: 'particulier' },
        { model: Artisan, as: 'artisan' },
        { model: Service, as: 'service' },
        { model: Disponibilite, as: 'disponibilite' },
        { model: AdresseParticulier, as: 'adresseParticulier' },
        { model: Paiement, as: 'paiement' },
        { model: Avis, as: 'avis' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateCommande', 'DESC']]
    });

    res.json({
      commandes: commandes.rows,
      total: commandes.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(commandes.count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir une commande par ID
exports.getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id, {
      include: [
        { model: Particulier, as: 'particulier' },
        { model: Artisan, as: 'artisan' },
        { model: Service, as: 'service' },
        { model: Disponibilite, as: 'disponibilite' },
        { model: AdresseParticulier, as: 'adresseParticulier' },
        { model: Paiement, as: 'paiement' },
        { model: Avis, as: 'avis' }
      ]
    });
    
    if (!commande) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    res.json(commande);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une nouvelle commande
exports.createCommande = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { serviceId, disponibiliteId, adresseParticulierId, description } = req.body;
    
    // Vérifier que le service existe
    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service non trouvé' });
    }
    
    // Vérifier que la disponibilité existe et est disponible
    const disponibilite = await Disponibilite.findByPk(disponibiliteId);
    if (!disponibilite || !disponibilite.isDisponible) {
      return res.status(400).json({ error: 'Disponibilité non trouvée ou non disponible' });
    }
    
    // Calculer le prix total
    const prixTotal = service.prixUnitaire;
    
    const commande = await Commande.create({
      ...req.body,
      prixTotal,
      dateCommande: new Date(),
      statut: 'en_attente_paiement'
    });
    
    res.status(201).json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mettre à jour une commande
exports.updateCommande = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    await commande.update(req.body);
    res.json(commande);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer une commande
exports.deleteCommande = async (req, res) => {
  try {
    const commande = await Commande.findByPk(req.params.id);
    if (!commande) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    await commande.destroy();
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les commandes d'un particulier
exports.getCommandesByParticulier = async (req, res) => {
  try {
    const { particulierId } = req.params;
    const commandes = await Commande.findAll({
      where: { particulierId },
      include: [
        { model: Artisan, as: 'artisan' },
        { model: Service, as: 'service' },
        { model: Disponibilite, as: 'disponibilite' },
        { model: Paiement, as: 'paiement' },
        { model: Avis, as: 'avis' }
      ],
      order: [['dateCommande', 'DESC']]
    });
    
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les commandes d'un artisan
exports.getCommandesByArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;
    const commandes = await Commande.findAll({
      where: { artisanId },
      include: [
        { model: Particulier, as: 'particulier' },
        { model: Service, as: 'service' },
        { model: Disponibilite, as: 'disponibilite' },
        { model: Paiement, as: 'paiement' },
        { model: Avis, as: 'avis' }
      ],
      order: [['dateCommande', 'DESC']]
    });
    
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Changer le statut d'une commande
exports.updateCommandeStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findByPk(req.params.id);
    
    if (!commande) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    await commande.update({ statut });
    res.json(commande);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 