const { Paiement, Commande } = require('../models');
const { validationResult } = require('express-validator');
const stripeService = require('../services/stripe.service');

// Obtenir tous les paiements avec pagination et filtres
exports.getAllPaiements = async (req, res) => {
  try {
    const { page = 1, limit = 10, statut, commandeId } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (statut) whereClause.statut = statut;
    if (commandeId) whereClause.commandeId = commandeId;

    const paiements = await Paiement.findAndCountAll({
      where: whereClause,
      include: [
        { model: Commande, as: 'commande' }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']]
    });

    res.json({
      paiements: paiements.rows,
      total: paiements.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(paiements.count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir un paiement par ID
exports.getPaiementById = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id, {
      include: [
        { model: Commande, as: 'commande' }
      ]
    });
    
    if (!paiement) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }
    
    res.json(paiement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer un nouveau paiement
exports.createPaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { commandeId, methode, montant } = req.body;
    
    // Vérifier que la commande existe
    const commande = await Commande.findByPk(commandeId);
    if (!commande) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    
    // Créer le paiement
    const paiement = await Paiement.create({
      commandeId,
      methode,
      montant,
      date: new Date(),
      statut: 'en_attente'
    });
    
    res.status(201).json(paiement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Traiter un paiement avec Stripe
exports.processPaiement = async (req, res) => {
  try {
    const { paiementId } = req.params;
    const { token } = req.body;
    
    const paiement = await Paiement.findByPk(paiementId, {
      include: [{ model: Commande, as: 'commande' }]
    });
    
    if (!paiement) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }
    
    // Traiter le paiement avec Stripe
    const stripePayment = await stripeService.createPayment({
      amount: paiement.montant * 100, // Stripe utilise les centimes
      currency: 'eur',
      source: token,
      description: `Paiement commande ${paiement.commande.id}`
    });
    
    // Mettre à jour le statut du paiement
    await paiement.update({
      statut: stripePayment.status === 'succeeded' ? 'payé' : 'refusé',
      stripePaymentId: stripePayment.id
    });
    
    // Mettre à jour le statut de la commande
    if (stripePayment.status === 'succeeded') {
      await paiement.commande.update({ statut: 'payée' });
    }
    
    res.json({
      paiement,
      stripePayment: {
        id: stripePayment.id,
        status: stripePayment.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un paiement
exports.updatePaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }
    
    await paiement.update(req.body);
    res.json(paiement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un paiement
exports.deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }
    
    await paiement.destroy();
    res.json({ message: 'Paiement supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtenir les paiements d'une commande
exports.getPaiementsByCommande = async (req, res) => {
  try {
    const { commandeId } = req.params;
    const paiements = await Paiement.findAll({
      where: { commandeId },
      order: [['date', 'DESC']]
    });
    
    res.json(paiements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rembourser un paiement
exports.refundPaiement = async (req, res) => {
  try {
    const { paiementId } = req.params;
    const paiement = await Paiement.findByPk(paiementId);
    
    if (!paiement) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }
    
    if (!paiement.stripePaymentId) {
      return res.status(400).json({ error: 'Paiement Stripe non trouvé' });
    }
    
    // Effectuer le remboursement via Stripe
    const refund = await stripeService.createRefund(paiement.stripePaymentId);
    
    // Mettre à jour le statut du paiement
    await paiement.update({ statut: 'remboursé' });
    
    res.json({
      paiement,
      refund: {
        id: refund.id,
        status: refund.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 