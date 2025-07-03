#!/usr/bin/env node

const { Artisan, Service, Disponibilite, AdresseArtisan, Avis, Commande } = require('../models');

/**
 * Script de test pour vérifier les associations Sequelize
 * Usage: node scripts/test-associations.js
 */

async function testAssociations() {
  console.log('🧪 === TEST DES ASSOCIATIONS SEQUELIZE ===\n');
  
  try {
    // Test 1: Vérifier que les modèles sont bien chargés
    console.log('1️⃣ Vérification des modèles...');
    console.log('✅ Artisan:', typeof Artisan);
    console.log('✅ Service:', typeof Service);
    console.log('✅ Disponibilite:', typeof Disponibilite);
    console.log('✅ AdresseArtisan:', typeof AdresseArtisan);
    console.log('✅ Avis:', typeof Avis);
    console.log('✅ Commande:', typeof Commande);
    
    // Test 2: Vérifier les associations d'Artisan
    console.log('\n2️⃣ Test des associations Artisan...');
    
    // Récupérer un artisan avec toutes ses associations
    const artisan = await Artisan.findOne({
      include: [
        { model: AdresseArtisan, as: 'AdresseArtisans' },
        { model: Service, as: 'services' },
        { model: Disponibilite, as: 'disponibilites' },
        { model: Commande, as: 'commandes' }
        // { model: Avis, as: 'avis' } // SUPPRIMÉ car pas de colonne artisanId dans avis
      ]
    });
    
    if (artisan) {
      console.log('✅ Artisan trouvé avec associations:', {
        id: artisan.id,
        nom: artisan.nom,
        adressesCount: artisan.AdresseArtisans?.length || 0,
        servicesCount: artisan.services?.length || 0,
        disponibilitesCount: artisan.disponibilites?.length || 0,
        commandesCount: artisan.commandes?.length || 0
        // avisCount: artisan.avis?.length || 0 // SUPPRIMÉ car pas de colonne artisanId dans avis
      });
    } else {
      console.log('⚠️ Aucun artisan trouvé dans la base de données');
    }
    
    // Test 3: Vérifier les associations de Service
    console.log('\n3️⃣ Test des associations Service...');
    
    const service = await Service.findOne({
      include: [
        { model: Artisan, as: 'artisan' },
        { model: Commande, as: 'commandes' }
      ]
    });
    
    if (service) {
      console.log('✅ Service trouvé avec associations:', {
        id: service.id,
        nom: service.nom,
        artisanId: service.artisan?.id,
        artisanNom: service.artisan?.nom,
        commandesCount: service.commandes?.length || 0
      });
    } else {
      console.log('⚠️ Aucun service trouvé dans la base de données');
    }
    
    // Test 4: Vérifier les associations de Commande
    console.log('\n4️⃣ Test des associations Commande...');
    
    const commande = await Commande.findOne({
      include: [
        { model: Artisan, as: 'artisan' },
        { model: Service, as: 'service' },
        { model: Disponibilite, as: 'disponibilite' },
        { model: Avis, as: 'avis' }
      ]
    });
    
    if (commande) {
      console.log('✅ Commande trouvée avec associations:', {
        id: commande.id,
        artisanId: commande.artisan?.id,
        serviceId: commande.service?.id,
        disponibiliteId: commande.disponibilite?.id,
        avisId: commande.avis?.id
      });
    } else {
      console.log('⚠️ Aucune commande trouvée dans la base de données');
    }
    
    console.log('\n🎉 Tous les tests d\'associations sont passés avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test des associations:', error.message);
    
    if (error.message.includes('alias')) {
      console.log('💡 Suggestion: Vérifiez que les alias dans les modèles correspondent à ceux utilisés dans les requêtes');
    }
    
    if (error.message.includes('model')) {
      console.log('💡 Suggestion: Vérifiez que tous les modèles sont bien importés et associés');
    }
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testAssociations();
}

module.exports = { testAssociations }; 