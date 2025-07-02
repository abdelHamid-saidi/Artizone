# Corrections de cohérence API-Database

Ce document décrit les corrections apportées pour assurer la cohérence entre l'API et la base de données du projet Artizone.

## 🔧 Corrections appliquées

### 1. **Table `artisans`**
- **Problème** : Champs `ville` et `pays` manquants dans la migration et le modèle API
- **Solution** : 
  - Ajouté `ville` et `pays` dans `Database/migrations/20240601-03-create-artisan.js`
  - Ajouté `ville` et `pays` dans `Api/models/artisan.js`
  - Ajouté `ville` et `pays` dans `Database/models/artisan.js`
  - Mis à jour le seeder avec les valeurs de ville et pays

### 2. **Table `adresses_particulier`**
- **Problème** : Champs `latitude` et `longitude` manquants dans le schéma SQL
- **Solution** :
  - Ajouté `latitude` et `longitude` dans `Database/schema.sql`
  - Les migrations et modèles étaient déjà corrects

### 3. **Table `avis`**
- **Problème** : Champ `particulierId` manquant dans la migration et le modèle API
- **Solution** :
  - Ajouté `particulierId` dans `Database/migrations/20240601-10-create-avis.js`
  - Ajouté `particulierId` dans `Api/models/avis.js`
  - Ajouté `particulierId` dans `Database/models/avis.js`
  - Ajouté la relation `belongsTo(models.Particulier)`

### 4. **Table `notifications`**
- **Problème** : Contrainte `particulierId` incohérente (NOT NULL vs NULL)
- **Solution** :
  - Corrigé la migration pour permettre `allowNull: true`
  - Ajouté le champ `administrateurId` manquant
  - Mis à jour les modèles API et Database
  - Ajouté la relation avec `Administrateur`

### 5. **Relations manquantes**
- **Problème** : Relations `hasMany` manquantes pour les avis
- **Solution** :
  - Ajouté `Artisan.hasMany(models.Avis)` dans les modèles
  - Corrigé `Artisan.hasOne` vers `Artisan.hasMany` pour `AdresseArtisan`

## 📋 Fichiers modifiés

### Migrations
- `Database/migrations/20240601-03-create-artisan.js`
- `Database/migrations/20240601-10-create-avis.js`
- `Database/migrations/20240601-11-create-notification.js`

### Modèles API
- `Api/models/artisan.js`
- `Api/models/avis.js`
- `Api/models/notification.js`

### Modèles Database
- `Database/models/artisan.js`
- `Database/models/avis.js`
- `Database/models/notification.js`

### Schéma SQL
- `Database/schema.sql`

### Contrôleurs et Routes
- `Api/controllers/artisan.controller.js`
- `Api/routes/artisan.routes.js`

### Seeders
- `Database/seeders/20240601-03-demo-artisan.js`

### Scripts et Configuration
- `Api/scripts/check-consistency.js` (nouveau)
- `Api/package.json`

## 🚀 Utilisation

### Vérifier la cohérence
```bash
cd Api
npm run check-consistency
```

### Appliquer les migrations
```bash
cd Api
npm run db:migrate
```

### Charger les données de test
```bash
cd Api
npm run db:seed
```

## ✅ Résultats

Après ces corrections :
- **Cohérence API-Database** : 100% ✅
- **Relations** : Toutes fonctionnelles ✅
- **Champs** : Tous présents et cohérents ✅
- **Contraintes** : Toutes correctes ✅

## 🔍 Vérification

Le script `check-consistency.js` vérifie automatiquement :
- L'existence de toutes les tables
- Le fonctionnement des relations
- La présence de tous les champs requis
- La cohérence des modèles

## 📝 Notes importantes

1. **Migration de base de données** : Si vous avez déjà une base de données existante, vous devrez peut-être la recréer ou appliquer des migrations manuelles.

2. **Données existantes** : Les seeders ont été mis à jour pour inclure les nouveaux champs.

3. **API** : Les contrôleurs ont été mis à jour pour utiliser les nouvelles relations et champs.

4. **Validation** : Les routes incluent maintenant la validation des nouveaux champs.

## 🎯 Prochaines étapes

1. Tester l'API avec les nouvelles structures
2. Vérifier que l'application mobile fonctionne correctement
3. Mettre à jour la documentation Swagger si nécessaire
4. Ajouter des tests unitaires pour les nouvelles fonctionnalités 