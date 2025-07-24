# Artizone - Base de Données

Gestion complète de la base de données pour la plateforme Artizone, incluant les migrations, seeders et modèles Sequelize.

## Vue d'ensemble

Ce module gère toute la logique de base de données pour Artizone, incluant :
- **Migrations** pour la structure de la base de données
- **Seeders** pour les données de test
- **Modèles Sequelize** pour l'ORM
- **Configuration** multi-environnement

## Technologies Utilisées

- **MySQL** - Base de données relationnelle
- **Sequelize** - ORM pour Node.js
- **Sequelize CLI** - Outils de migration et seeding
- **Node.js** - Runtime JavaScript

## Installation

### Prérequis
- **Node.js** (v18 ou supérieur)
- **MySQL** (v8.0 ou supérieur)
- **npm** ou **yarn**

### Installation des dépendances
```bash
cd Database
npm install
```

### Configuration
Créer un fichier `.env` dans le dossier `Database/` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=artizone
DB_PORT=3306
NODE_ENV=development
```

## Structure de la Base de Données

### Tables Principales

#### Utilisateurs
- **`particuliers`** - Clients de la plateforme
- **`artisans`** - Prestataires de services
- **`administrateurs`** - Gestionnaires de la plateforme

#### Services et Catégories
- **`categories`** - Catégories de services
- **`services`** - Services proposés par les artisans
- **`disponibilites`** - Plannings des artisans

#### Commandes et Paiements
- **`commandes`** - Réservations de services
- **`paiements`** - Transactions de paiement
- **`avis`** - Évaluations des services

#### Adresses
- **`adresses_particulier`** - Adresses des clients
- **`adresses_artisan`** - Adresses des artisans

#### Notifications
- **`notifications`** - Notifications système

## Commandes Disponibles

### Gestion de la Base de Données
```bash
# Créer la base de données
npm run db:create

# Supprimer la base de données
npm run db:drop

# Vérifier la connexion
npm run db:test
```

### Migrations
```bash
# Exécuter toutes les migrations
npm run db:migrate

# Annuler la dernière migration
npm run db:migrate:undo

# Annuler toutes les migrations
npm run db:migrate:undo:all

# Voir le statut des migrations
npm run db:migrate:status
```

### Seeders (Données de Test)
```bash
# Insérer toutes les données de test
npm run db:seed

# Supprimer toutes les données de test
npm run db:seed:undo

# Insérer un seeder spécifique
npm run db:seed -- --seed nom-du-seeder.js

# Annuler un seeder spécifique
npm run db:seed:undo -- --seed nom-du-seeder.js
```

### Utilitaires
```bash
# Vérifier la cohérence des données
npm run check-consistency

# Générer un dump SQL
npm run db:dump

# Restaurer depuis un dump
npm run db:restore
```

## Structure du Projet

```
Database/
├── config/
│   ├── config.json          # Configuration Sequelize
│   └── database.js          # Configuration dynamique
├── migrations/
│   ├── 20240601-01-create-administrateur.js
│   ├── 20240601-02-create-particulier.js
│   ├── 20240601-03-create-artisan.js
│   ├── 20240601-04-create-adresseparticulier.js
│   ├── 20240601-05-create-adresseartisan.js
│   ├── 20240601-06-create-categorie.js
│   ├── 20240601-06-create-service.js
│   ├── 20240601-07-create-disponibilite.js
│   ├── 20240601-08-create-commande.js
│   ├── 20240601-09-create-paiement.js
│   ├── 20240601-10-create-avis.js
│   └── 20240601-11-create-notification.js
├── models/
│   ├── administrateur.js
│   ├── particulier.js
│   ├── artisan.js
│   ├── categorie.js
│   ├── service.js
│   ├── disponibilite.js
│   ├── commande.js
│   ├── paiement.js
│   ├── avis.js
│   ├── notification.js
│   ├── adresseparticulier.js
│   ├── adresseartisan.js
│   └── index.js
├── seeders/
│   ├── 20240601-01-demo-administrateur.js
│   ├── 20240601-02-demo-particulier.js
│   ├── 20240601-03-demo-artisan.js
│   ├── 20240601-04-demo-adresseparticulier.js
│   ├── 20240601-05-demo-adresseartisan.js
│   ├── 20240601-06-demo-categorie.js
│   ├── 20240601-06-demo-service.js
│   ├── 20240601-07-demo-disponibilite.js
│   ├── 20240601-08-demo-commande.js
│   ├── 20240601-09-demo-paiement.js
│   ├── 20240601-10-demo-avis.js
│   └── 20240601-11-demo-notification.js
├── .sequelizerc              # Configuration Sequelize CLI
├── schema.sql                # Schéma SQL complet
└── package.json
```

## Relations entre Tables

### Relations Principales
- **Particuliers** ↔ **Adresses** (1:N)
- **Artisans** ↔ **Adresses** (1:N)
- **Artisans** ↔ **Services** (1:N)
- **Services** ↔ **Catégories** (N:1)
- **Artisans** ↔ **Disponibilités** (1:N)
- **Particuliers** ↔ **Commandes** (1:N)
- **Artisans** ↔ **Commandes** (1:N)
- **Services** ↔ **Commandes** (1:N)
- **Commandes** ↔ **Paiements** (1:1)
- **Commandes** ↔ **Avis** (1:N)
- **Utilisateurs** ↔ **Notifications** (1:N)

## Données de Test

### Administrateurs
- Compte admin principal avec tous les droits
- Comptes de modération pour la gestion

### Particuliers
- Utilisateurs de test avec profils complets
- Adresses de test pour les réservations

### Artisans
- Artisans de différentes catégories
- Services variés avec tarifs
- Disponibilités pour les tests

### Catégories
- Plomberie, Électricité, Jardinage
- Peinture, Menuiserie, Nettoyage
- Déménagement, Réparation

### Commandes
- Commandes en différents statuts
- Historique complet pour les tests

## Sécurité

### Configuration Sécurisée
- **Variables d'environnement** pour les secrets
- **Validation des données** au niveau base
- **Contraintes d'intégrité** référentielle
- **Index optimisés** pour les performances

### Bonnes Pratiques
- **Migrations versionnées** pour les changements
- **Seeders idempotents** pour les données de test
- **Backup automatique** avant les migrations
- **Rollback** en cas d'erreur

## Tests

### Tests de Cohérence
```bash
npm run check-consistency
```

### Tests de Performance
```bash
npm run test:performance
```

### Tests d'Intégrité
```bash
npm run test:integrity
```

## Monitoring

### Métriques de Performance
- **Temps de réponse** des requêtes
- **Utilisation** de la mémoire
- **Connexions** actives
- **Requêtes** lentes

### Logs et Debugging
- **Logs de migration** détaillés
- **Erreurs SQL** avec contexte
- **Statistiques** d'utilisation

## Dépannage

### Problèmes Courants

1. **Erreur de connexion**
   - Vérifier les paramètres de connexion
   - Contrôler que MySQL est démarré
   - Vérifier les permissions utilisateur

2. **Erreur de migration**
   - Vérifier la syntaxe SQL
   - Contrôler les contraintes
   - Rollback en cas d'erreur

3. **Problèmes de performance**
   - Analyser les requêtes lentes
   - Optimiser les index
   - Vérifier la configuration MySQL

## Maintenance

### Tâches Régulières
- **Backup quotidien** de la base
- **Nettoyage** des logs anciens
- **Optimisation** des tables
- **Mise à jour** des statistiques

### Procédures de Migration
1. **Backup** de la base existante
2. **Test** des migrations en dev
3. **Validation** des données
4. **Déploiement** en production
5. **Vérification** post-migration

## Contribution

1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet fait partie d'Artizone. Tous droits réservés © 2025.

---

**Base de Données Artizone** - Gérer les données avec fiabilité ! 