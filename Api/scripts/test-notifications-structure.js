const { Notification, Particulier, Administrateur } = require('../models');

// Configuration de test
const TEST_EMAIL = 'test@example.com';

// Fonction pour vérifier la structure de la base de données
async function checkDatabaseStructure() {
  console.log('🗄️ === VÉRIFICATION DE LA STRUCTURE DES NOTIFICATIONS ===\n');
  
  try {
    // 1. Vérifier le modèle Notification
    console.log('📋 1. Attributs du modèle Notification:');
    const notificationAttributes = Object.keys(Notification.rawAttributes);
    console.log('   ✅ Attributs trouvés:', notificationAttributes);
    
    // Vérifier les attributs requis
    const requiredAttributes = ['id', 'type', 'contenu', 'dateEnvoi', 'statut', 'particulierId', 'administrateurId'];
    const missingAttributes = requiredAttributes.filter(attr => !notificationAttributes.includes(attr));
    
    if (missingAttributes.length === 0) {
      console.log('   ✅ Tous les attributs requis sont présents');
    } else {
      console.log('   ❌ Attributs manquants:', missingAttributes);
    }
    
    // 2. Vérifier les associations
    console.log('\n🔗 2. Associations du modèle Notification:');
    const associations = Notification.associations;
    const associationNames = Object.keys(associations);
    console.log('   ✅ Associations trouvées:', associationNames);
    
    // Vérifier les associations requises
    const requiredAssociations = ['Particulier', 'Administrateur'];
    const missingAssociations = requiredAssociations.filter(assoc => !associationNames.includes(assoc));
    
    if (missingAssociations.length === 0) {
      console.log('   ✅ Toutes les associations requises sont présentes');
    } else {
      console.log('   ❌ Associations manquantes:', missingAssociations);
    }
    
    // 3. Vérifier la table
    console.log('\n📊 3. Informations de la table:');
    const tableName = Notification.tableName;
    console.log('   ✅ Nom de la table:', tableName);
    
    // 4. Vérifier les contraintes
    console.log('\n🔒 4. Contraintes et clés:');
    const rawAttributes = Notification.rawAttributes;
    
    // Vérifier la clé primaire
    if (rawAttributes.id && rawAttributes.id.primaryKey) {
      console.log('   ✅ Clé primaire configurée sur id');
    } else {
      console.log('   ❌ Clé primaire manquante sur id');
    }
    
    // Vérifier le type UUID
    if (rawAttributes.id && rawAttributes.id.type && rawAttributes.id.type.key === 'UUID') {
      console.log('   ✅ Type UUID configuré pour id');
    } else {
      console.log('   ❌ Type UUID non configuré pour id');
    }
    
    // Vérifier les clés étrangères
    if (rawAttributes.particulierId && rawAttributes.particulierId.references) {
      console.log('   ✅ Clé étrangère particulierId configurée');
    } else {
      console.log('   ❌ Clé étrangère particulierId manquante');
    }
    
    if (rawAttributes.administrateurId && rawAttributes.administrateurId.references) {
      console.log('   ✅ Clé étrangère administrateurId configurée');
    } else {
      console.log('   ❌ Clé étrangère administrateurId manquante');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur vérification structure DB:', error.message);
    return false;
  }
}

// Fonction pour vérifier les modèles associés
async function checkAssociatedModels() {
  console.log('\n👥 === VÉRIFICATION DES MODÈLES ASSOCIÉS ===\n');
  
  try {
    // 1. Vérifier le modèle Particulier
    console.log('👤 1. Modèle Particulier:');
    if (Particulier) {
      const particulierAttributes = Object.keys(Particulier.rawAttributes);
      console.log('   ✅ Modèle Particulier trouvé');
      console.log('   📋 Attributs:', particulierAttributes);
    } else {
      console.log('   ❌ Modèle Particulier non trouvé');
    }
    
    // 2. Vérifier le modèle Administrateur
    console.log('\n👨‍💼 2. Modèle Administrateur:');
    if (Administrateur) {
      const adminAttributes = Object.keys(Administrateur.rawAttributes);
      console.log('   ✅ Modèle Administrateur trouvé');
      console.log('   📋 Attributs:', adminAttributes);
    } else {
      console.log('   ❌ Modèle Administrateur non trouvé');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur vérification modèles associés:', error.message);
    return false;
  }
}

// Fonction pour créer des notifications de test
async function createTestNotifications() {
  console.log('\n📝 === CRÉATION DE NOTIFICATIONS DE TEST ===\n');
  
  try {
    // Récupérer un particulier de test
    const particulier = await Particulier.findOne({
      where: { email: TEST_EMAIL }
    });
    
    if (!particulier) {
      console.log('⚠️ Particulier de test non trouvé, création d\'un particulier de test...');
      
      // Créer un particulier de test
      const newParticulier = await Particulier.create({
        nom: 'Utilisateur Test',
        email: TEST_EMAIL,
        motDePasse: 'password123',
        telephone: '+33 6 12 34 56 78'
      });
      
      console.log('✅ Particulier de test créé:', newParticulier.id);
    } else {
      console.log('✅ Particulier de test trouvé:', particulier.id);
    }
    
    const particulierId = particulier ? particulier.id : (await Particulier.findOne({ where: { email: TEST_EMAIL } })).id;
    
    // Créer des notifications de test
    const testNotifications = [
      {
        type: 'reservation',
        contenu: 'Votre réservation avec l\'artisan Jean Dupont a été confirmée pour le 15/12/2024 à 14h00.',
        dateEnvoi: new Date(),
        statut: 'non_lu',
        particulierId: particulierId
      },
      {
        type: 'message',
        contenu: 'Nouveau message de l\'artisan Marie Martin concernant votre demande de devis.',
        dateEnvoi: new Date(Date.now() - 3600000), // 1 heure ago
        statut: 'non_lu',
        particulierId: particulierId
      },
      {
        type: 'reminder',
        contenu: 'Rappel : Votre rendez-vous avec l\'artisan Pierre Durand est prévu demain à 10h00.',
        dateEnvoi: new Date(Date.now() - 7200000), // 2 heures ago
        statut: 'lu',
        particulierId: particulierId
      }
    ];
    
    const createdNotifications = await Notification.bulkCreate(testNotifications);
    console.log(`✅ ${createdNotifications.length} notifications de test créées`);
    
    // Afficher les notifications créées
    createdNotifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ${notif.type} - ${notif.contenu.substring(0, 50)}...`);
    });
    
    return { particulierId, notifications: createdNotifications };
  } catch (error) {
    console.error('❌ Erreur création notifications de test:', error.message);
    return null;
  }
}

// Fonction pour tester les requêtes Sequelize
async function testSequelizeQueries(particulierId) {
  console.log('\n🔍 === TEST DES REQUÊTES SEQUELIZE ===\n');
  
  try {
    // 1. Test de récupération des notifications
    console.log('📋 1. Test récupération des notifications:');
    const notifications = await Notification.findAll({
      where: { particulierId: particulierId },
      order: [['dateEnvoi', 'DESC']],
      include: [
        {
          model: Particulier,
          as: 'Particulier',
          attributes: ['id', 'nom', 'email']
        }
      ]
    });
    
    console.log(`   ✅ ${notifications.length} notifications récupérées`);
    
    // Afficher les détails
    notifications.forEach((notif, index) => {
      console.log(`   ${index + 1}. ID: ${notif.id}, Type: ${notif.type}, Statut: ${notif.statut}`);
      if (notif.Particulier) {
        console.log(`      Particulier: ${notif.Particulier.nom} (${notif.Particulier.email})`);
      }
    });
    
    // 2. Test de mise à jour
    if (notifications.length > 0) {
      console.log('\n✏️ 2. Test mise à jour notification:');
      const firstNotification = notifications[0];
      const updatedNotification = await firstNotification.update({ statut: 'lu' });
      console.log(`   ✅ Notification ${firstNotification.id} mise à jour: ${updatedNotification.statut}`);
    }
    
    // 3. Test de mise à jour en masse
    console.log('\n📝 3. Test mise à jour en masse:');
    const updateResult = await Notification.update(
      { statut: 'lu' },
      { 
        where: { 
          particulierId: particulierId,
          statut: 'non_lu'
        } 
      }
    );
    console.log(`   ✅ ${updateResult[0]} notifications mises à jour`);
    
    // 4. Test de comptage
    console.log('\n📊 4. Test comptage:');
    const totalCount = await Notification.count({ where: { particulierId: particulierId } });
    const unreadCount = await Notification.count({ 
      where: { 
        particulierId: particulierId,
        statut: 'non_lu'
      } 
    });
    const readCount = await Notification.count({ 
      where: { 
        particulierId: particulierId,
        statut: 'lu'
      } 
    });
    
    console.log(`   📈 Total: ${totalCount}, Non lues: ${unreadCount}, Lues: ${readCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur test requêtes Sequelize:', error.message);
    return false;
  }
}

// Fonction pour nettoyer les données de test
async function cleanupTestData(particulierId) {
  console.log('\n🧹 === NETTOYAGE DES DONNÉES DE TEST ===\n');
  
  try {
    // Supprimer les notifications de test
    const deletedNotifications = await Notification.destroy({
      where: {
        particulierId: particulierId
      }
    });
    
    console.log(`✅ ${deletedNotifications} notifications de test supprimées`);
    
    // Supprimer le particulier de test
    const deletedParticulier = await Particulier.destroy({
      where: {
        email: TEST_EMAIL
      }
    });
    
    console.log(`✅ ${deletedParticulier} particulier de test supprimé`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur nettoyage données de test:', error.message);
    return false;
  }
}

// Fonction principale de test
async function runStructureTests() {
  console.log('🚀 === TEST DE STRUCTURE DES NOTIFICATIONS ===\n');
  
  let particulierId = null;
  
  try {
    // 1. Vérifier la structure de la base de données
    const dbStructureOk = await checkDatabaseStructure();
    if (!dbStructureOk) {
      console.error('❌ Structure de base de données invalide');
      return;
    }
    
    // 2. Vérifier les modèles associés
    const associatedModelsOk = await checkAssociatedModels();
    if (!associatedModelsOk) {
      console.error('❌ Modèles associés invalides');
      return;
    }
    
    // 3. Créer des notifications de test
    const testData = await createTestNotifications();
    if (!testData) {
      console.error('❌ Impossible de créer les données de test');
      return;
    }
    
    particulierId = testData.particulierId;
    
    // 4. Tester les requêtes Sequelize
    const queriesOk = await testSequelizeQueries(particulierId);
    if (!queriesOk) {
      console.error('❌ Erreur lors des tests de requêtes');
    }
    
    console.log('\n✅ === TESTS DE STRUCTURE TERMINÉS AVEC SUCCÈS ===');
    
  } catch (error) {
    console.error('💥 Erreur lors des tests:', error);
  } finally {
    // 5. Nettoyer les données de test
    if (particulierId) {
      await cleanupTestData(particulierId);
    }
  }
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runStructureTests()
    .then(() => {
      console.log('\n🎉 Tests de structure terminés avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur lors des tests:', error);
      process.exit(1);
    });
}

module.exports = {
  runStructureTests,
  checkDatabaseStructure,
  checkAssociatedModels,
  createTestNotifications,
  testSequelizeQueries,
  cleanupTestData
}; 