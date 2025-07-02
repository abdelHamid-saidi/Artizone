const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  getNotificationsByParticulier,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  deleteNotification
} = require('../controllers/notification.controller');

// Récupérer toutes les notifications d'un particulier
router.get('/particulier/:particulierId', authMiddleware, getNotificationsByParticulier);

// Marquer une notification comme lue
router.patch('/:notificationId/lu', authMiddleware, markNotificationAsRead);

// Marquer toutes les notifications d'un particulier comme lues
router.patch('/particulier/:particulierId/lu-toutes', authMiddleware, markAllNotificationsAsRead);

// Créer une nouvelle notification (admin seulement)
router.post('/', authMiddleware, createNotification);

// Supprimer une notification (admin seulement)
router.delete('/:notificationId', authMiddleware, deleteNotification);

module.exports = router; 