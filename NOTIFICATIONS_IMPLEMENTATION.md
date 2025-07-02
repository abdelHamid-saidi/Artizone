# Système de Notifications - Artizone

## Vue d'ensemble

Le système de notifications a été implémenté pour permettre aux particuliers de recevoir et gérer leurs notifications dans l'application mobile Artizone. Les notifications sont récupérées depuis l'API et affichées dans l'ordre chronologique décroissant (les plus récentes en premier).

## Architecture

### Backend (API)

#### Modèle de données
- **Fichier**: `Api/models/notification.js`
- **Structure**:
  - `id`: UUID (clé primaire)
  - `type`: Type de notification (reservation, message, reminder, promo, commande, paiement)
  - `contenu`: Contenu textuel de la notification
  - `dateEnvoi`: Date d'envoi de la notification
  - `statut`: Statut de lecture ('lu' ou 'non_lu')
  - `particulierId`: ID du particulier destinataire
  - `administrateurId`: ID de l'administrateur émetteur (optionnel)

#### Contrôleur
- **Fichier**: `Api/controllers/notification.controller.js`
- **Fonctionnalités**:
  - `getNotificationsByParticulier`: Récupérer toutes les notifications d'un particulier
  - `markNotificationAsRead`: Marquer une notification comme lue
  - `markAllNotificationsAsRead`: Marquer toutes les notifications comme lues
  - `createNotification`: Créer une nouvelle notification (admin)
  - `deleteNotification`: Supprimer une notification (admin)

#### Routes
- **Fichier**: `Api/routes/notification.routes.js`
- **Endpoints**:
  - `GET /api/notifications/particulier/:particulierId` - Récupérer les notifications
  - `PATCH /api/notifications/:notificationId/lu` - Marquer comme lue
  - `PATCH /api/notifications/particulier/:particulierId/lu-toutes` - Marquer toutes comme lues
  - `POST /api/notifications` - Créer une notification (admin)
  - `DELETE /api/notifications/:notificationId` - Supprimer une notification (admin)

### Frontend (Mobile)

#### Service API
- **Fichier**: `Mobile/src/services/api.ts`
- **Service**: `notificationService`
- **Fonctionnalités**:
  - `getNotifications(particulierId)`: Récupérer les notifications
  - `markAsRead(notificationId)`: Marquer comme lue
  - `markAllAsRead(particulierId)`: Marquer toutes comme lues

#### Écran de notifications
- **Fichier**: `Mobile/src/screens/NotificationsScreen.tsx`
- **Fonctionnalités**:
  - Affichage des notifications avec design moderne
  - Indicateurs visuels pour les notifications non lues
  - Pull-to-refresh pour actualiser
  - Bouton pour marquer toutes comme lues
  - Gestion des états de chargement et d'erreur

## Fonctionnalités

### 1. Récupération des notifications
- Les notifications sont récupérées automatiquement au chargement de l'écran
- Tri par ordre chronologique décroissant (plus récentes en premier)
- Inclut les informations du particulier associé

### 2. Gestion du statut de lecture
- Indicateur visuel pour les notifications non lues
- Marquage automatique comme lue lors du clic
- Possibilité de marquer toutes les notifications comme lues

### 3. Interface utilisateur
- Design moderne avec cartes pour chaque notification
- Icônes colorées selon le type de notification
- Formatage intelligent des dates (il y a X heures/jours)
- États de chargement et d'erreur gérés

### 4. Types de notifications supportés
- **reservation**: Réservations confirmées/modifiées
- **message**: Nouveaux messages
- **reminder**: Rappels de rendez-vous
- **promo**: Offres promotionnelles
- **commande**: Mises à jour de commandes
- **paiement**: Notifications de paiement

## Sécurité

### Authentification
- Toutes les routes nécessitent un token d'authentification
- Vérification que l'utilisateur ne peut accéder qu'à ses propres notifications
- Les administrateurs peuvent accéder à toutes les notifications

### Autorisation
- Seuls les administrateurs peuvent créer/supprimer des notifications
- Les particuliers ne peuvent voir que leurs propres notifications
- Vérification des permissions sur chaque action

## Utilisation

### Pour les développeurs

#### Créer une notification (côté admin)
```javascript
const notification = await Notification.create({
  type: 'reservation',
  contenu: 'Votre réservation a été confirmée',
  particulierId: 'uuid-du-particulier',
  administrateurId: 'uuid-admin'
});
```

#### Récupérer les notifications (côté mobile)
```typescript
const response = await notificationService.getNotifications(userId);
const notifications = response.data;
```

#### Marquer comme lue
```typescript
await notificationService.markAsRead(notificationId);
```

### Pour les utilisateurs

1. **Accès**: Naviguer vers l'écran "Notifications" dans l'application
2. **Lecture**: Cliquer sur une notification pour la marquer comme lue
3. **Actualisation**: Tirer vers le bas pour actualiser la liste
4. **Marquage en masse**: Utiliser le bouton "Marquer toutes comme lues"

## Gestion des erreurs

### Côté API
- Erreurs 403 pour accès non autorisé
- Erreurs 404 pour notifications non trouvées
- Erreurs 500 pour problèmes serveur
- Messages d'erreur explicites

### Côté Mobile
- Gestion des timeouts réseau
- Messages d'erreur utilisateur-friendly
- Retry automatique possible
- États de chargement appropriés

## Tests recommandés

1. **Test de récupération**: Vérifier que les notifications s'affichent correctement
2. **Test de marquage**: Vérifier que le statut change lors du clic
3. **Test de rafraîchissement**: Vérifier le pull-to-refresh
4. **Test d'erreur**: Tester avec des données invalides
5. **Test de sécurité**: Vérifier les permissions d'accès

## Évolutions futures

- Notifications push en temps réel
- Filtrage par type de notification
- Pagination pour de grandes listes
- Notifications groupées
- Préférences de notification par utilisateur 