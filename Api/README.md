# API Artizone

API REST complète pour la plateforme Artizone - mise en relation entre particuliers et artisans.

## 🚀 Fonctionnalités

- **Authentification multi-rôles** : Particuliers, Artisans, Administrateurs
- **Gestion des services** : Création, modification, recherche de services
- **Système de réservation** : Gestion des disponibilités et commandes
- **Paiements sécurisés** : Intégration Stripe
- **Notifications** : Système de notifications Firebase
- **API Documentation** : Documentation Swagger complète
- **Sécurité renforcée** : Rate limiting, validation, authentification JWT

## 📋 Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone https://github.com/abdelHamid-saidi/Artizone.git
cd Artizone/Api
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp env.example .env
```

Éditer le fichier `.env` avec vos configurations :
```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration de la base de données
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=artizone_db
DB_NAME_TEST=artizone_test_db

# JWT Secret
JWT_SECRET=votre_jwt_secret_tres_securise
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT=10

# CORS
CORS_ORIGIN=http://localhost:3000

# Stripe (optionnel)
STRIPE_SECRET_KEY=sk_test_votre_cle_stripe

# Firebase (optionnel)
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=votre_projet_firebase
FIREBASE_PRIVATE_KEY_ID=votre_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nvotre_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=votre_client_email
FIREBASE_CLIENT_ID=votre_client_id
```

4. **Configuration de la base de données**
```bash
# Créer la base de données
mysql -u root -p -e "CREATE DATABASE artizone_db;"

# Exécuter les migrations
npm run db:migrate

# Ajouter des données de test (optionnel)
npm run db:seed
```

5. **Lancer le serveur**
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur avec nodemon

# Production
npm start            # Lance le serveur en mode production

# Base de données
npm run db:migrate   # Exécute les migrations
npm run db:seed      # Ajoute des données de test

# Tests et vérifications
npm run check-consistency  # Vérifie la cohérence API-Database
npm run test-auth         # Teste le système d'authentification
```

## 📚 Documentation API

Une fois le serveur lancé, la documentation Swagger est disponible à :
- **URL** : http://localhost:3000/api-docs
- **Health Check** : http://localhost:3000/health

## 🔐 Authentification

### Types d'utilisateurs

1. **Particuliers** : Clients qui recherchent des services
2. **Artisans** : Prestataires de services
3. **Administrateurs** : Gestion de la plateforme

### Endpoints d'authentification

```
POST /api/auth/particulier/register  # Inscription particulier
POST /api/auth/particulier/login     # Connexion particulier

POST /api/auth/artisan/register      # Inscription artisan
POST /api/auth/artisan/login         # Connexion artisan

POST /api/auth/admin/register        # Inscription admin
POST /api/auth/admin/login           # Connexion admin

GET  /api/auth/verify                # Vérifier le token
POST /api/auth/logout                # Déconnexion
```

### Utilisation des tokens

```javascript
// Ajouter le token dans les headers
headers: {
  'Authorization': 'Bearer votre_token_jwt'
}
```

## 🛡️ Sécurité

### Fonctionnalités de sécurité implémentées

- **Rate Limiting** : Limitation des requêtes par IP
- **Helmet** : Headers de sécurité HTTP
- **CORS** : Configuration sécurisée des origines
- **Validation** : Validation des données avec express-validator
- **JWT** : Authentification par tokens
- **Bcrypt** : Hashage sécurisé des mots de passe
- **Validation Sequelize** : Validation au niveau de la base de données

### Rate Limiting

- **Général** : 100 requêtes par IP par 15 minutes
- **Authentification** : 5 tentatives par IP par 15 minutes

## 🔧 Configuration

### Variables d'environnement importantes

| Variable | Description | Requis |
|----------|-------------|--------|
| `JWT_SECRET` | Clé secrète pour les tokens JWT | ✅ |
| `DB_HOST` | Hôte de la base de données | ✅ |
| `DB_USER` | Utilisateur de la base de données | ✅ |
| `DB_PASSWORD` | Mot de passe de la base de données | ✅ |
| `DB_NAME` | Nom de la base de données | ✅ |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | ❌ |
| `FIREBASE_PROJECT_ID` | ID du projet Firebase | ❌ |

### Configuration de la base de données

Le fichier `config/database.js` gère automatiquement :
- Les variables d'environnement
- Les configurations par environnement (dev/test/prod)
- Les pools de connexion pour la production

## 🚨 Corrections apportées

### Version 1.1.0 - Corrections majeures

1. **Configuration de base de données**
   - ✅ Correction de l'incohérence entre `config/database.js` et `config/config.json`
   - ✅ Support des variables d'environnement `DB_PASSWORD` et `DB_PASS`
   - ✅ Configuration complète pour tous les environnements

2. **Modèle Artisan**
   - ✅ Ajout des champs `email` et `motDePasse` manquants
   - ✅ Ajout du champ `statut` pour la gestion des comptes
   - ✅ Validation complète des champs
   - ✅ Support de l'authentification

3. **Authentification**
   - ✅ Support complet des artisans dans l'authentification
   - ✅ Vérification des emails uniques across toutes les tables
   - ✅ Gestion du statut des artisans (actif/inactif/en_attente)
   - ✅ Middleware d'authentification pour artisans

4. **Services externes**
   - ✅ Service Firebase amélioré avec gestion d'erreurs
   - ✅ Service Stripe amélioré avec validation
   - ✅ Gestion gracieuse des services non configurés

5. **Sécurité et gestion d'erreurs**
   - ✅ Gestion globale des erreurs Sequelize
   - ✅ Rate limiting amélioré
   - ✅ Validation des données renforcée
   - ✅ Headers de sécurité HTTP

6. **Routes API**
   - ✅ Correction des routes dupliquées
   - ✅ Correction de la syntaxe avec spread operator
   - ✅ Support complet pour les artisans dans toutes les routes
   - ✅ Permissions claires et logiques
   - ✅ Séparation des responsabilités

7. **Documentation et tests**
   - ✅ Script de vérification de cohérence amélioré
   - ✅ Documentation Swagger mise à jour
   - ✅ Tests d'authentification complets

## 🧪 Tests

### Vérification de cohérence
```bash
npm run check-consistency
```

### Tests d'authentification
```bash
npm run test-auth
```

## 📊 Structure de la base de données

### Tables principales
- `particuliers` : Utilisateurs clients
- `artisans` : Prestataires de services
- `administrateurs` : Gestionnaires de la plateforme
- `services` : Services proposés par les artisans
- `commandes` : Réservations de services
- `paiements` : Transactions de paiement
- `avis` : Évaluations des services
- `disponibilites` : Plannings des artisans

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation Swagger
- Vérifier les logs du serveur

## 🔄 Changelog

### v1.1.0 (2024-01-XX)
- ✅ Corrections majeures de l'authentification
- ✅ Support complet des artisans
- ✅ Amélioration de la sécurité
- ✅ Gestion d'erreurs renforcée
- ✅ Documentation mise à jour

### v1.0.0 (2024-01-XX)
- 🎉 Version initiale
- ✅ Authentification de base
- ✅ CRUD des entités principales
- ✅ Documentation Swagger