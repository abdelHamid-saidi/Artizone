const {
  Artisan,
  Particulier,
  Service,
  Commande,
  Paiement,
  Avis,
  Disponibilite
} = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// Statistiques générales
exports.getGeneralStats = async (req, res) => {
  try {
    const [
      totalParticuliers,
      totalArtisans,
      totalServices,
      totalCommandes,
      totalPaiements,
      totalAvis
    ] = await Promise.all([
      Particulier.count(),
      Artisan.count(),
      Service.count(),
      Commande.count(),
      Paiement.count(),
      Avis.count()
    ]);

    // Chiffre d'affaires total
    const totalRevenue = await Paiement.sum('montant', {
      where: { statut: 'payé' }
    });

    // Note moyenne globale
    const avgRating = await Avis.findOne({
      attributes: [[fn('AVG', col('note')), 'average']]
    });

    res.json({
      totalParticuliers,
      totalArtisans,
      totalServices,
      totalCommandes,
      totalPaiements,
      totalAvis,
      totalRevenue: totalRevenue || 0,
      noteMoyenneGlobale: parseFloat(avgRating?.dataValues?.average || 0).toFixed(1)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statistiques des commandes
exports.getCommandeStats = async (req, res) => {
  try {
    const { periode = '30' } = req.query;
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - parseInt(periode));

    // Commandes par statut
    const commandesParStatut = await Commande.findAll({
      attributes: [
        'statut',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: dateLimite }
      },
      group: ['statut']
    });

    // Commandes par jour
    const commandesParJour = await Commande.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: dateLimite }
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']]
    });

    // Top artisans par commandes
    const topArtisans = await Commande.findAll({
      attributes: [
        'artisanId',
        [fn('COUNT', col('id')), 'totalCommandes']
      ],
      where: {
        createdAt: { [Op.gte]: dateLimite }
      },
      include: [
        { model: Artisan, as: 'artisan', attributes: ['nom'] }
      ],
      group: ['artisanId'],
      order: [[fn('COUNT', col('id')), 'DESC']],
      limit: 10
    });

    res.json({
      commandesParStatut,
      commandesParJour,
      topArtisans
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statistiques des paiements
exports.getPaiementStats = async (req, res) => {
  try {
    const { periode = '30' } = req.query;
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - parseInt(periode));

    // Paiements par statut
    const paiementsParStatut = await Paiement.findAll({
      attributes: [
        'statut',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('montant')), 'total']
      ],
      where: {
        date: { [Op.gte]: dateLimite }
      },
      group: ['statut']
    });

    // Paiements par méthode
    const paiementsParMethode = await Paiement.findAll({
      attributes: [
        'methode',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('montant')), 'total']
      ],
      where: {
        date: { [Op.gte]: dateLimite }
      },
      group: ['methode']
    });

    // Revenus par jour
    const revenusParJour = await Paiement.findAll({
      attributes: [
        [fn('DATE', col('date')), 'date'],
        [fn('SUM', col('montant')), 'total']
      ],
      where: {
        date: { [Op.gte]: dateLimite },
        statut: 'payé'
      },
      group: [fn('DATE', col('date'))],
      order: [[fn('DATE', col('date')), 'ASC']]
    });

    res.json({
      paiementsParStatut,
      paiementsParMethode,
      revenusParJour
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statistiques des avis
exports.getAvisStats = async (req, res) => {
  try {
    const { periode = '30' } = req.query;
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - parseInt(periode));

    // Répartition des notes
    const repartitionNotes = await Avis.findAll({
      attributes: [
        'note',
        [fn('COUNT', col('id')), 'count']
      ],
      where: {
        date: { [Op.gte]: dateLimite }
      },
      group: ['note'],
      order: [['note', 'ASC']]
    });

    // Top artisans par note
    const topArtisansParNote = await Avis.findAll({
      attributes: [
        'artisanId',
        [fn('AVG', col('note')), 'noteMoyenne'],
        [fn('COUNT', col('id')), 'totalAvis']
      ],
      where: {
        date: { [Op.gte]: dateLimite }
      },
      include: [
        { model: Artisan, as: 'artisan', attributes: ['nom'] }
      ],
      group: ['artisanId'],
      having: literal('COUNT(id) >= 3'),
      order: [[fn('AVG', col('note')), 'DESC']],
      limit: 10
    });

    // Avis par jour
    const avisParJour = await Avis.findAll({
      attributes: [
        [fn('DATE', col('date')), 'date'],
        [fn('COUNT', col('id')), 'count'],
        [fn('AVG', col('note')), 'noteMoyenne']
      ],
      where: {
        date: { [Op.gte]: dateLimite }
      },
      group: [fn('DATE', col('date'))],
      order: [[fn('DATE', col('date')), 'ASC']]
    });

    res.json({
      repartitionNotes,
      topArtisansParNote,
      avisParJour
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Statistiques des services
exports.getServiceStats = async (req, res) => {
  try {
    // Services les plus populaires
    const servicesPopulaires = await Service.findAll({
      attributes: [
        'id',
        'nom',
        'prixUnitaire',
        [fn('COUNT', col('commandes.id')), 'totalCommandes']
      ],
      include: [
        { model: Commande, as: 'commandes', attributes: [] }
      ],
      group: ['Service.id'],
      order: [[fn('COUNT', col('commandes.id')), 'DESC']],
      limit: 10
    });

    // Prix moyens par service
    const prixMoyens = await Service.findAll({
      attributes: [
        'nom',
        [fn('AVG', col('prixUnitaire')), 'prixMoyen']
      ],
      group: ['nom'],
      order: [[fn('AVG', col('prixUnitaire')), 'DESC']]
    });

    res.json({
      servicesPopulaires,
      prixMoyens
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 