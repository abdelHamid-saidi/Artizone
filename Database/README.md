# Artizone Database

Ce projet contient uniquement la gestion de la base de données pour Artizone.

## Installation

```bash
npm install
```

## Configuration

1. Copiez le fichier de configuration de la base de données :
```bash
cp config/config.json.example config/config.json
```

2. Configurez les paramètres de connexion à la base de données dans `config/config.json`

## Commandes disponibles

### Gestion de la base de données
```bash
# Créer la base de données
npm run db:create

# Supprimer la base de données
npm run db:drop
```

### Migrations
```bash
# Exécuter toutes les migrations
npm run migrate

# Annuler la dernière migration
npm run migrate:undo

# Annuler toutes les migrations
npm run migrate:undo:all
```

### Seeders (données de test)
```bash
# Insérer toutes les données de test
npm run seed

# Supprimer toutes les données de test
npm run seed:undo
```

## Structure du projet

```
├── config/          # Configuration de la base de données
├── migrations/      # Fichiers de migration
├── models/          # Modèles Sequelize
├── seeders/         # Données de test
├── .sequelizerc     # Configuration Sequelize CLI
└── schema.sql       # Schéma SQL de la base de données
``` 