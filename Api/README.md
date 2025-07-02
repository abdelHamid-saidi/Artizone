# Artizone - Plateforme de Services Artisanaux

## Structure du Projet

Le projet est organisé avec tous les fichiers dans la racine :

### 📁 Structure Principale
- **`app.js`** - Point d'entrée principal de l'application
- **`controllers/`** - Contrôleurs pour gérer les requêtes HTTP
- **`routes/`** - Définition des routes API
- **`middlewares/`** - Middlewares personnalisés (authentification, validation, etc.)
- **`services/`** - Services métier (Firebase, Stripe, etc.)
- **`models/`** - Modèles Sequelize pour l'accès aux données
- **`config/`** - Configuration de l'application
- **`swagger/`** - Documentation API avec Swagger
- **`test-routes.js`** - Tests des routes

## Installation et Démarrage

```bash
# Installation des dépendances
npm install

# Configuration des variables d'environnement
cp env.example .env
# Éditez le fichier .env avec vos configurations

# Démarrage en mode développement
npm run dev

# Démarrage en production
npm start
```

## Configuration

### Variables d'Environnement

Copiez le fichier `env.example` vers `.env` et configurez les variables suivantes :

- **Base de données** : Configuration MySQL
- **JWT_SECRET** : Clé secrète pour les tokens JWT
- **STRIPE_SECRET_KEY** : Clé API Stripe pour les paiements (optionnel)
- **Firebase** : Configuration pour les notifications push (optionnel)

## Documentation API

La documentation Swagger est disponible à l'adresse : `http://localhost:3000/api-docs`

## Services Intégrés

- **Stripe** : Gestion des paiements (optionnel)
- **Firebase** : Notifications push (optionnel)
- **JWT** : Authentification sécurisée