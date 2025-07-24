# Artizone - Application Mobile

Application mobile React Native pour les particuliers de la plateforme Artizone, développée avec Expo.

## Vue d'ensemble

Cette application mobile permet aux particuliers de rechercher des artisans, réserver des services, suivre leurs commandes et gérer leur profil utilisateur.

## Technologies Utilisées

- **React Native** - Framework mobile cross-platform
- **Expo** - Outils de développement et déploiement
- **TypeScript** - Typage statique pour la sécurité
- **React Navigation** - Navigation entre écrans
- **React Native Elements** & **React Native Paper** - Composants UI
- **Expo Location** & **React Native Maps** - Géolocalisation
- **Expo Notifications** - Notifications push
- **AsyncStorage** - Stockage local
- **Axios** - Appels API

## Installation

### Prérequis
- **Node.js** (v18 ou supérieur)
- **Expo CLI** : `npm install -g @expo/cli`
- **Expo Go** (application mobile pour tester)
- **API Artizone** en cours d'exécution

### Installation des dépendances
```bash
cd Mobile
npm install
```

### Configuration
Créer un fichier `.env` dans le dossier `Mobile/` :
```env
API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Démarrage
```bash
npm start
```

Scannez le QR code avec l'application Expo Go sur votre téléphone.

## Fonctionnalités

### Authentification
- **Inscription** avec validation des données
- **Connexion** sécurisée avec JWT
- **Récupération de mot de passe** par email
- **Vérification d'email** pour l'inscription
- **Gestion des sessions** persistantes

### Accueil et Navigation
- **Page d'accueil** avec présentation des services
- **Navigation par onglets** intuitive
- **Recherche rapide** d'artisans
- **Notifications** en temps réel

### Recherche d'Artisans
- **Recherche par catégorie** de service
- **Filtrage par localisation** (GPS)
- **Recherche textuelle** par nom ou service
- **Carte interactive** avec géolocalisation
- **Filtres avancés** (note, distance, disponibilité)

### Profils d'Artisans
- **Informations détaillées** de l'artisan
- **Galerie de photos** des réalisations
- **Avis et notes** des clients
- **Services proposés** avec tarifs
- **Disponibilités** en temps réel
- **Contact direct** avec l'artisan

### Réservation de Services
- **Sélection de service** avec détails
- **Choix de date et heure** avec calendrier
- **Sélection d'adresse** de prestation
- **Confirmation de réservation**
- **Paiement sécurisé** avec Stripe

### Suivi des Commandes
- **Liste des commandes** en cours et terminées
- **Statut en temps réel** des commandes
- **Historique détaillé** de chaque commande
- **Notifications** de mise à jour
- **Annulation** de commandes

### Système d'Avis
- **Notation** des services (1-5 étoiles)
- **Commentaires** détaillés
- **Photos** des réalisations
- **Historique** des avis donnés

### Gestion du Profil
- **Informations personnelles** modifiables
- **Adresses** de prestation
- **Méthodes de paiement** sauvegardées
- **Préférences** de notification
- **Historique** des commandes

### Notifications
- **Notifications push** pour les mises à jour
- **Alertes** de nouvelles commandes
- **Rappels** de rendez-vous
- **Messages** des artisans

## Interface Utilisateur

### Design System
- **Thème cohérent** avec la marque Artizone
- **Interface intuitive** et accessible
- **Animations fluides** pour l'UX
- **Responsive design** pour tous les écrans

### Écrans Principaux
- **Splash Screen** - Écran de démarrage
- **Landing Page** - Présentation de l'app
- **Login/Signup** - Authentification
- **Home** - Accueil avec recherche
- **Artisan List** - Liste des artisans
- **Artisan Detail** - Profil détaillé
- **Reservation** - Processus de réservation
- **Orders** - Suivi des commandes
- **Profile** - Gestion du profil
- **Notifications** - Centre de notifications

## Scripts Disponibles

```bash
# Développement
npm start              # Démarrage du serveur Expo
npm run android        # Lancer sur émulateur Android
npm run ios            # Lancer sur émulateur iOS
npm run web            # Lancer en mode web

# Utilitaires
npm run get-ip         # Obtenir l'IP locale
npm run build          # Build de production
```

## Configuration Expo

### app.json
```json
{
  "expo": {
    "name": "Artizone",
    "slug": "artizone-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## Sécurité

### Authentification
- **JWT tokens** avec expiration
- **Stockage sécurisé** des tokens
- **Validation** côté client et serveur
- **Déconnexion automatique** en cas d'expiration

### Données Sensibles
- **Chiffrement** des données locales
- **Validation** des entrées utilisateur
- **Protection** contre les injections
- **HTTPS** pour toutes les communications

## Tests

### Tests Unitaires
```bash
npm test
```

### Tests d'Intégration
```bash
npm run test:integration
```

### Tests E2E
```bash
npm run test:e2e
```

## Build et Déploiement

### Build de Production
```bash
# Android
expo build:android

# iOS
expo build:ios

# Web
expo build:web
```

### Publication
```bash
# Publier sur Expo
expo publish

# Déployer sur stores
expo submit
```

## Dépannage

### Problèmes Courants

1. **Erreur de connexion API**
   - Vérifier que l'API est en cours d'exécution
   - Contrôler l'URL dans `.env`
   - Vérifier la configuration CORS

2. **Problèmes de géolocalisation**
   - Vérifier les permissions de localisation
   - Contrôler la configuration GPS
   - Tester sur un appareil physique

3. **Erreurs de build**
   - Nettoyer le cache : `expo r -c`
   - Vérifier les dépendances : `npm install`
   - Contrôler la configuration Expo

4. **Problèmes de notifications**
   - Vérifier la configuration Firebase
   - Contrôler les permissions push
   - Tester sur un appareil physique

## Métriques et Analytics

### Suivi des Performances
- **Temps de chargement** des écrans
- **Taux de conversion** des réservations
- **Utilisation** des fonctionnalités
- **Erreurs** et crashs

### Analytics Utilisateur
- **Comportement** de navigation
- **Préférences** de recherche
- **Engagement** avec les artisans
- **Satisfaction** utilisateur

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet fait partie d'Artizone. Tous droits réservés © 2025.

---

**Application Mobile Artizone** - Trouvez et réservez des artisans en quelques clics !
