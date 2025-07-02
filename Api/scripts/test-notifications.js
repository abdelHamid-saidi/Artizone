const { Notification, Particulier } = require('../models');
const { sequelize } = require('../models');

async function testNotifications() {
  try {
    console.log('🔍 === TEST DES NOTIFICATIONS ===');
    
    // 1. Vérifier la connexion à la base de données
    console.log('📊 Vérification de la connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
    
    // 2. Vérifier si la table notifications existe
    console.log('📋 Vérification de la table notifications...');
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    console.log('Tables disponibles:', tableExists);
    
    if (!tableExists.includes('notifications')) {
      console.log('❌ Table notifications non trouvée');
      console.log('💡 Création de la table...');
      await sequelize.sync({ force: false });
      console.log('✅ Table notifications créée');
    } else {
      console.log('✅ Table notifications existe');
    }
    
    // 3. Compter les notifications existantes
    console.log('🔢 Comptage des notifications existantes...');
    const count = await Notification.count();
    console.log(`📊 Nombre de notifications: ${count}`);
    
    // 4. Lister tous les particuliers
    console.log('👥 Liste des particuliers...');
    const particuliers = await Particulier.findAll({
      attributes: ['id', 'nom', 'email'],
      limit: 5
    });
    console.log('Particuliers trouvés:', particuliers.map(p => ({ id: p.id, nom: p.nom, email: p.email })));
    
    // 5. Si aucun particulier, créer un test
    if (particuliers.length === 0) {
      console.log('⚠️ Aucun particulier trouvé, création d\'un particulier de test...');
      const testParticulier = await Particulier.create({
        nom: 'Test Particulier',
        email: 'test@example.com',
        motDePasse: 'test123'
      });
      console.log('✅ Particulier de test créé:', testParticulier.id);
    }
    
    // 6. Créer des notifications de test si aucune n'existe
    if (count === 0) {
      console.log('📝 Création de notifications de test...');
      const particulierId = particuliers.length > 0 ? particuliers[0].id : (await Particulier.findOne()).id;
      
      const notificationsTest = [
        {
          type: 'reservation',
          contenu: 'Votre réservation de plomberie a été confirmée par Jean Dupont',
          dateEnvoi: new Date(),
          statut: 'non_lu',
          particulierId: particulierId
        },
        {
          type: 'message',
          contenu: 'Marie Martin vous a envoyé un message concernant votre demande',
          dateEnvoi: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2h
          statut: 'non_lu',
          particulierId: particulierId
        },
        {
          type: 'reminder',
          contenu: 'Votre rendez-vous avec Sophie Bernard est dans 1 heure',
          dateEnvoi: new Date(Date.now() - 24 * 60 * 60 * 1000), // Il y a 1j
          statut: 'lu',
          particulierId: particulierId
        },
        {
          type: 'promo',
          contenu: '-20% sur tous les services de ménage cette semaine',
          dateEnvoi: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2j
          statut: 'lu',
          particulierId: particulierId
        }
      ];
      
      for (const notifData of notificationsTest) {
        const notification = await Notification.create(notifData);
        console.log(`✅ Notification créée: ${notification.type} - ${notification.contenu.substring(0, 50)}...`);
      }
    }
    
    // 7. Tester la récupération des notifications
    console.log('🔍 Test de récupération des notifications...');
    const particulierId = particuliers.length > 0 ? particuliers[0].id : (await Particulier.findOne()).id;
    
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
    
    console.log(`📊 Notifications trouvées pour le particulier ${particulierId}: ${notifications.length}`);
    notifications.forEach((notif, index) => {
      console.log(`${index + 1}. [${notif.type}] ${notif.contenu.substring(0, 50)}... (${notif.statut})`);
    });
    
    // 8. Test de l'API endpoint
    console.log('🌐 Test de l\'endpoint API...');
    console.log(`URL à tester: GET /api/notifications/particulier/${particulierId}`);
    console.log('Headers requis: Authorization: Bearer <token>');
    
    console.log('\n✅ === TEST TERMINÉ ===');
    console.log('💡 Si les notifications s\'affichent ici mais pas dans l\'app, vérifiez:');
    console.log('   1. L\'API est-elle démarrée ? (npm start dans le dossier Api)');
    console.log('   2. L\'URL de l\'API est-elle correcte dans Mobile/src/config/api.ts ?');
    console.log('   3. L\'utilisateur est-il connecté avec un token valide ?');
    console.log('   4. L\'ID utilisateur correspond-il à celui dans la base ?');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await sequelize.close();
  }
}

// Exécuter le test
testNotifications(); 