const { Notification, Particulier, Administrateur } = require('../models');

// Récupérer toutes les notifications d'un particulier
const getNotificationsByParticulier = async (req, res) => {
  try {
    const { particulierId } = req.params;
    
    // Vérifier que l'utilisateur connecté est bien le particulier demandé
    if (req.user.id !== particulierId) {
      return res.status(403).json({ 
        error: 'Accès non autorisé' 
      });
    }

    const notifications = await Notification.findAll({
      where: { 
        particulierId: particulierId 
      },
      order: [['dateEnvoi', 'DESC']], // Ordre décroissant pour avoir les plus récentes en premier
      include: [
        {
          model: Particulier,
          as: 'Particulier',
          attributes: ['id', 'nom', 'email']
        }
      ]
    });

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération des notifications' 
    });
  }
};

// Marquer une notification comme lue
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      return res.status(404).json({ 
        error: 'Notification non trouvée' 
      });
    }

    // Vérifier que l'utilisateur connecté est bien le propriétaire de la notification
    if (notification.particulierId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Accès non autorisé' 
      });
    }

    await notification.update({ 
      statut: 'lu' 
    });

    res.json({
      success: true,
      message: 'Notification marquée comme lue',
      data: notification
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la mise à jour de la notification' 
    });
  }
};

// Marquer toutes les notifications d'un particulier comme lues
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { particulierId } = req.params;
    
    // Vérifier que l'utilisateur connecté est bien le particulier demandé
    if (req.user.id !== particulierId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Accès non autorisé' 
      });
    }

    await Notification.update(
      { statut: 'lu' },
      { 
        where: { 
          particulierId: particulierId,
          statut: 'non_lu'
        } 
      }
    );

    res.json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la mise à jour des notifications' 
    });
  }
};

// Créer une nouvelle notification (pour les administrateurs)
const createNotification = async (req, res) => {
  try {
    const { type, contenu, particulierId, administrateurId } = req.body;
    
    // Vérifier que l'utilisateur connecté est un administrateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Accès non autorisé - Administrateur requis' 
      });
    }

    const notification = await Notification.create({
      type,
      contenu,
      dateEnvoi: new Date(),
      statut: 'non_lu',
      particulierId,
      administrateurId: administrateurId || req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Notification créée avec succès',
      data: notification
    });

  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la création de la notification' 
    });
  }
};

// Supprimer une notification (pour les administrateurs)
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Vérifier que l'utilisateur connecté est un administrateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Accès non autorisé - Administrateur requis' 
      });
    }

    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      return res.status(404).json({ 
        error: 'Notification non trouvée' 
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: 'Notification supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la suppression de la notification' 
    });
  }
};

module.exports = {
  getNotificationsByParticulier,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  deleteNotification
}; 