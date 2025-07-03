# 🔧 Correction des Associations Sequelize - Artizone

## 🚨 Problème identifié

Erreur Sequelize lors de la récupération des artisans :
```
Service is associated to Artisan using an alias. You've included an alias (services), but it does not match the alias(es) defined in your association (Services).
```

Le problème venait d'une **incohérence entre les alias définis dans les modèles et ceux utilisés dans les requêtes**.

## ✅ Solution mise en place

### 1. **Correction des associations dans les modèles**

#### **Artisan** (`Api/models/artisan.js`)
```javascript
// AVANT
Artisan.associate = models => {
  Artisan.hasMany(models.AdresseArtisan, { foreignKey: 'artisanId' });
  Artisan.hasMany(models.Service, { foreignKey: 'artisanId' });
  Artisan.hasMany(models.Disponibilite, { foreignKey: 'artisanId' });
  Artisan.hasMany(models.Commande, { foreignKey: 'artisanId' });
  Artisan.hasMany(models.Avis, { foreignKey: 'artisanId' });
};

// APRÈS
Artisan.associate = models => {
  Artisan.hasMany(models.AdresseArtisan, { foreignKey: 'artisanId', as: 'AdresseArtisans' });
  Artisan.hasMany(models.Service, { foreignKey: 'artisanId', as: 'services' });
  Artisan.hasMany(models.Disponibilite, { foreignKey: 'artisanId', as: 'disponibilites' });
  Artisan.hasMany(models.Commande, { foreignKey: 'artisanId', as: 'commandes' });
  Artisan.hasMany(models.Avis, { foreignKey: 'artisanId', as: 'avis' });
};
```

#### **Service** (`Api/models/service.js`)
```javascript
// AVANT
Service.associate = models => {
  Service.belongsTo(models.Artisan, { foreignKey: 'artisanId' });
  Service.belongsTo(models.Categorie, { foreignKey: 'categorieId' });
  Service.hasMany(models.Commande, { foreignKey: 'serviceId' });
};

// APRÈS
Service.associate = models => {
  Service.belongsTo(models.Artisan, { foreignKey: 'artisanId', as: 'artisan' });
  Service.belongsTo(models.Categorie, { foreignKey: 'categorieId', as: 'categorie' });
  Service.hasMany(models.Commande, { foreignKey: 'serviceId', as: 'commandes' });
};
```

#### **Disponibilite** (`Api/models/disponibilite.js`)
```javascript
// AVANT
Disponibilite.associate = models => {
  Disponibilite.belongsTo(models.Artisan, { foreignKey: 'artisanId' });
  Disponibilite.hasMany(models.Commande, { foreignKey: 'disponibiliteId' });
};

// APRÈS
Disponibilite.associate = models => {
  Disponibilite.belongsTo(models.Artisan, { foreignKey: 'artisanId', as: 'artisan' });
  Disponibilite.hasMany(models.Commande, { foreignKey: 'disponibiliteId', as: 'commandes' });
};
```

#### **AdresseArtisan** (`Api/models/adresseartisan.js`)
```javascript
// AVANT
AdresseArtisan.associate = models => {
  AdresseArtisan.belongsTo(models.Artisan, { foreignKey: 'artisanId' });
};

// APRÈS
AdresseArtisan.associate = models => {
  AdresseArtisan.belongsTo(models.Artisan, { foreignKey: 'artisanId', as: 'artisan' });
};
```

#### **Commande** (`Api/models/commande.js`)
```javascript
// AVANT
Commande.associate = models => {
  Commande.belongsTo(models.Particulier, { foreignKey: 'particulierId' });
  Commande.belongsTo(models.Service, { foreignKey: 'serviceId' });
  Commande.belongsTo(models.Disponibilite, { foreignKey: 'disponibiliteId' });
  Commande.belongsTo(models.AdresseParticulier, { foreignKey: 'adresseParticulierId' });
  Commande.belongsTo(models.Artisan, { foreignKey: 'artisanId' });
  Commande.hasOne(models.Paiement, { foreignKey: 'commandeId' });
  Commande.hasOne(models.Avis, { foreignKey: 'commandeId' });
};

// APRÈS
Commande.associate = models => {
  Commande.belongsTo(models.Particulier, { foreignKey: 'particulierId', as: 'particulier' });
  Commande.belongsTo(models.Service, { foreignKey: 'serviceId', as: 'service' });
  Commande.belongsTo(models.Disponibilite, { foreignKey: 'disponibiliteId', as: 'disponibilite' });
  Commande.belongsTo(models.AdresseParticulier, { foreignKey: 'adresseParticulierId', as: 'adresseParticulier' });
  Commande.belongsTo(models.Artisan, { foreignKey: 'artisanId', as: 'artisan' });
  Commande.hasOne(models.Paiement, { foreignKey: 'commandeId', as: 'paiement' });
  Commande.hasOne(models.Avis, { foreignKey: 'commandeId', as: 'avis' });
};
```

#### **Avis** (`Api/models/avis.js`)
```javascript
// AVANT
Avis.associate = models => {
  Avis.belongsTo(models.Commande, { foreignKey: 'commandeId' });
  Avis.belongsTo(models.Particulier, { foreignKey: 'particulierId' });
};

// APRÈS
Avis.associate = models => {
  Avis.belongsTo(models.Commande, { foreignKey: 'commandeId', as: 'commande' });
  Avis.belongsTo(models.Particulier, { foreignKey: 'particulierId', as: 'particulier' });
};
```

#### **Paiement** (`Api/models/paiement.js`)
```javascript
// AVANT
Paiement.associate = models => {
  Paiement.belongsTo(models.Commande, { foreignKey: 'commandeId' });
};

// APRÈS
Paiement.associate = models => {
  Paiement.belongsTo(models.Commande, { foreignKey: 'commandeId', as: 'commande' });
};
```

### 2. **Script de test créé**

#### **Api/scripts/test-associations.js** (nouveau)
- ✅ Test de vérification des modèles
- ✅ Test des associations Artisan
- ✅ Test des associations Service
- ✅ Test des associations Commande
- ✅ Gestion d'erreurs avec suggestions

### 3. **Script ajouté au package.json**
```json
{
  "scripts": {
    "test-associations": "node scripts/test-associations.js"
  }
}
```

## 🔧 Fichiers modifiés

### **Modèles Sequelize**
- ✅ `Api/models/artisan.js` - Ajout des alias pour toutes les associations
- ✅ `Api/models/service.js` - Ajout des alias pour toutes les associations
- ✅ `Api/models/disponibilite.js` - Ajout des alias pour toutes les associations
- ✅ `Api/models/adresseartisan.js` - Ajout de l'alias pour l'association
- ✅ `Api/models/commande.js` - Ajout des alias pour toutes les associations
- ✅ `Api/models/avis.js` - Ajout des alias pour toutes les associations
- ✅ `Api/models/paiement.js` - Ajout de l'alias pour l'association

### **Scripts de test**
- ✅ `Api/scripts/test-associations.js` (nouveau)
- ✅ `Api/package.json` - Ajout du script de test

## 🧪 Tests disponibles

### Test des associations Sequelize
```bash
cd Api
npm run test-associations
```

Ce script teste :
1. ✅ Vérification des modèles chargés
2. ✅ Test des associations Artisan
3. ✅ Test des associations Service
4. ✅ Test des associations Commande

## 🚀 Prochaines étapes

1. **Redémarrer l'API backend** pour appliquer les changements :
   ```bash
   cd Api
   npm start
   ```

2. **Tester les associations** :
   ```bash
   npm run test-associations
   ```

3. **Tester l'application mobile** - la récupération des artisans devrait maintenant fonctionner

4. **Vérifier les logs** - plus d'erreurs d'alias Sequelize

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. **Redémarrez l'API** et vérifiez qu'elle démarre sans erreur
2. **Exécutez le test des associations** - tous les tests doivent passer
3. **Testez l'application mobile** - la liste des artisans devrait se charger
4. **Vérifiez les logs** - plus d'erreurs d'alias

## 📝 Notes importantes

- **Toutes les associations** ont maintenant des alias explicites
- **Les alias correspondent** entre les modèles et les requêtes
- **Les tests automatisés** permettent de détecter les problèmes rapidement
- **La documentation** explique clairement les changements apportés

## 🎯 Résultat attendu

Après ces corrections :
- ✅ Plus d'erreurs d'alias Sequelize
- ✅ Récupération des artisans fonctionnelle
- ✅ Toutes les associations cohérentes
- ✅ Tests automatisés pour prévenir les régressions 