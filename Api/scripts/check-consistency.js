const { sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

async function checkConsistency() {
  console.log('🔍 Vérification de la cohérence API-Database...\n');

  try {
    // Test de connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Vérifier que toutes les tables existent
    const tables = [
      'administrateurs',
      'particuliers', 
      'artisans',
      'categories',
      'adresses_particulier',
      'adresses_artisan',
      'services',
      'disponibilites',
      'commandes',
      'paiements',
      'avis',
      'notifications'
    ];

    console.log('\n📋 Vérification des tables...');
    for (const table of tables) {
      try {
        await sequelize.query(`SELECT 1 FROM ${table} LIMIT 1`);
        console.log(`✅ Table ${table} existe`);
      } catch (error) {
        console.log(`❌ Table ${table} manquante: ${error.message}`);
      }
    }

    // Vérifier les relations
    console.log('\n🔗 Vérification des relations...');
    
    // Test des relations Artisan
    try {
      const artisan = await sequelize.models.Artisan.findOne({
        include: [
          { model: sequelize.models.AdresseArtisan, as: 'AdresseArtisans' },
          { model: sequelize.models.Service, as: 'services' },
          { model: sequelize.models.Disponibilite, as: 'disponibilites' },
          { model: sequelize.models.Avis, as: 'avis' }
        ]
      });
      console.log('✅ Relations Artisan fonctionnelles');
    } catch (error) {
      console.log(`❌ Erreur relations Artisan: ${error.message}`);
    }

    // Test des relations Commande
    try {
      const commande = await sequelize.models.Commande.findOne({
        include: [
          { model: sequelize.models.Particulier, as: 'particulier' },
          { model: sequelize.models.Artisan, as: 'artisan' },
          { model: sequelize.models.Service, as: 'service' },
          { model: sequelize.models.Avis, as: 'avis' }
        ]
      });
      console.log('✅ Relations Commande fonctionnelles');
    } catch (error) {
      console.log(`❌ Erreur relations Commande: ${error.message}`);
    }

    // Vérifier les champs des modèles
    console.log('\n📝 Vérification des champs des modèles...');
    
    const expectedFields = {
      Artisan: ['id', 'nom', 'telephone', 'langue', 'noteMoyenne', 'ville', 'pays'],
      Avis: ['id', 'note', 'commentaire', 'date', 'particulierId', 'commandeId'],
      Notification: ['id', 'type', 'contenu', 'dateEnvoi', 'statut', 'particulierId', 'administrateurId']
    };

    for (const [modelName, expectedFieldList] of Object.entries(expectedFields)) {
      const model = sequelize.models[modelName];
      if (model) {
        const actualFields = Object.keys(model.rawAttributes);
        const missingFields = expectedFieldList.filter(field => !actualFields.includes(field));
        const extraFields = actualFields.filter(field => !expectedFieldList.includes(field) && !['createdAt', 'updatedAt'].includes(field));
        
        if (missingFields.length === 0 && extraFields.length === 0) {
          console.log(`✅ Modèle ${modelName}: tous les champs sont corrects`);
        } else {
          if (missingFields.length > 0) {
            console.log(`❌ Modèle ${modelName}: champs manquants: ${missingFields.join(', ')}`);
          }
          if (extraFields.length > 0) {
            console.log(`⚠️  Modèle ${modelName}: champs supplémentaires: ${extraFields.join(', ')}`);
          }
        }
      } else {
        console.log(`❌ Modèle ${modelName} non trouvé`);
      }
    }

    console.log('\n🎉 Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Exécuter la vérification si le script est appelé directement
if (require.main === module) {
  checkConsistency();
}

module.exports = { checkConsistency }; 