# Artizone - Plateforme de Mise en Relation Artisans/Particuliers

**Artizone** est une plateforme complète de mise en relation entre particuliers et artisans locaux, développée avec une architecture moderne et scalable.

## Vue d'ensemble

Artizone est composée de trois applications principales :

- **Application Mobile** (React Native + Expo) - Interface utilisateur pour les particuliers
- **Interface Web Admin** (React.js + Material-UI) - Dashboard d'administration
- **API Backend** (Node.js + Express + Sequelize) - API REST sécurisée
- **Base de données** (MySQL) - Gestion des données avec migrations

## Architecture du Projet

```
Artizone/
├── Mobile/                 # Application React Native
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   ├── screens/          # Écrans de l'application
│   │   ├── navigation/       # Configuration de navigation
│   │   ├── services/         # Services API et stockage
│   │   └── styles/           # Styles et thèmes
│   └── assets/               # Images et ressources
├── Web/                   # Interface d'administration
│   ├── src/
│   │   ├── components/       # Composants UI
│   │   ├── pages/           # Pages de l'application
│   │   └── services/        # Services API
├── Api/                   # Backend Node.js
│   ├── controllers/          # Contrôleurs métier
│   ├── models/              # Modèles Sequelize
│   ├── routes/              # Routes API
│   ├── middlewares/         # Middlewares (auth, validation)
│   ├── services/            # Services externes (Stripe, Firebase)
│   └── swagger/             # Documentation API
└── Database/             # Gestion de la base de données
    ├── migrations/          # Migrations Sequelize
    ├── seeders/            # Données de test
    └── models/             # Modèles de données
```

## Technologies Utilisées

### Frontend Mobile
- **React Native** avec **Expo** pour le développement cross-platform
- **TypeScript** pour la sécurité des types
- **React Navigation** pour la navigation
- **React Native Elements** et **React Native Paper** pour l'UI
- **Expo Location** et **React Native Maps** pour la géolocalisation
- **Expo Notifications** pour les notifications push

### Frontend Web (Admin)
- **React.js** avec **Material-UI**
- **React Router** pour la navigation
- **Recharts** pour les graphiques et statistiques
- **Axios** pour les appels API
- **Tailwind CSS** pour le styling

### Backend
- **Node.js** avec **Express.js**
- **Sequelize ORM** pour la gestion de la base de données
- **MySQL** comme base de données
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **Stripe** pour les paiements
- **Firebase Admin** pour les notifications push
- **Swagger** pour la documentation API
- **Helmet** et **CORS** pour la sécurité

## Fonctionnalités Principales

### Pour les Particuliers (Mobile)
- **Inscription/Connexion** sécurisée
- **Recherche d'artisans** par catégorie et localisation
- **Consultation des profils** artisans avec avis et photos
- **Réservation de services** avec calendrier
- **Suivi des commandes** en temps réel
- **Système d'avis** et notation
- **Notifications push** pour les mises à jour
- **Gestion du profil** utilisateur
- **Historique des commandes**

### Pour les Administrateurs (Web)
- **Dashboard** avec statistiques en temps réel
- **Gestion des utilisateurs** (particuliers et artisans)
- **Suivi des commandes** et paiements
- **Modération des avis** et signalements
- **Gestion des catégories** de services
- **Statistiques** et rapports détaillés

### API Backend
- **Authentification JWT** sécurisée
- **Gestion des rôles** (particulier, artisan, admin)
- **API RESTful** complète
- **Validation des données** avec express-validator
- **Rate limiting** pour la sécurité
- **Documentation Swagger** interactive
- **Intégration Stripe** pour les paiements
- **Notifications Firebase** push

## Installation et Configuration

### Prérequis
- **Node.js** (v18 ou supérieur)
- **MySQL** (v8.0 ou supérieur)
- **Expo CLI** pour le développement mobile
- **Git**

### 1. Cloner le projet
```bash
git clone https://github.com/abdelHamid-saidi/Artizone.git
cd Artizone
```

### 2. Configuration de la Base de Données
```bash
cd Database
npm install
```

Créer un fichier `.env` dans le dossier `Database/` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=artizone
DB_PORT=3306
```

Exécuter les migrations :
```bash
npm run db:migrate
npm run db:seed
```

### 3. Configuration de l'API Backend
```bash
cd Api
npm install
```

Créer un fichier `.env` dans le dossier `Api/` :
```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=artizone
DB_PORT=3306

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_stripe

# Firebase
FIREBASE_PROJECT_ID=votre_projet_firebase
FIREBASE_PRIVATE_KEY=votre_cle_privee_firebase
FIREBASE_CLIENT_EMAIL=votre_email_client_firebase

# Configuration serveur
PORT=3000
NODE_ENV=development
```

Démarrer l'API :
```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3000`
Documentation Swagger : `http://localhost:3000/api-docs`

### 4. Configuration de l'Application Mobile
```bash
cd Mobile
npm install
```

Créer un fichier `.env` dans le dossier `Mobile/` :
```env
API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Démarrer l'application :
```bash
npm start
```

### 5. Configuration de l'Interface Web Admin
```bash
cd Web
npm install
```

Démarrer l'interface admin :
```bash
npm start
```

L'interface admin sera disponible sur `http://localhost:3001`

## Utilisation

### Application Mobile
1. Scannez le QR code avec l'application Expo Go
2. Créez un compte ou connectez-vous
3. Explorez les artisans par catégorie
4. Réservez des services
5. Suivez vos commandes

### Interface Admin
1. Accédez à `http://localhost:3001`
2. Connectez-vous avec les identifiants admin
3. Gérez les utilisateurs, commandes et statistiques

## Documentation API

L'API est documentée avec Swagger et accessible à :
- **URL** : `http://localhost:3000/api-docs`
- **Endpoints principaux** :
  - `/api/auth` - Authentification
  - `/api/artisans` - Gestion des artisans
  - `/api/services` - Gestion des services
  - `/api/commandes` - Gestion des commandes
  - `/api/paiements` - Gestion des paiements
  - `/api/avis` - Gestion des avis

## Sécurité

- **Authentification JWT** avec expiration
- **Hachage des mots de passe** avec bcryptjs
- **Rate limiting** pour prévenir les attaques
- **Validation des données** côté serveur
- **CORS** configuré pour la sécurité
- **Helmet** pour les en-têtes de sécurité
- **Variables d'environnement** pour les secrets

## Équipe de Développement

- **SAIDI Abdelhamid** – Développeur Full-stack / Mobile
- **KHINOUCHE Mehdi** – Développeur Full-stack / Mobile

## Licence

Ce projet est développé à des fins pédagogiques. Tous droits réservés © 2025.

**Artizone** - Connecter les artisans et les particuliers, une commande à la fois !
