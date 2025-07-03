const https = require('https');
const http = require('http');
const { Notification, Particulier } = require('../models');

// Configuration de test
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

// Fonction utilitaire pour faire des requêtes HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };
    
    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Fonction pour tester l'authentification
async function testAuth() {
  console.log('🔐 Test d\'authentification...');
  
  try {
    const response = await makeRequest(`${API_BASE_URL}/auth/particulier/login`, {
      method: 'POST',
      body: {
        email: TEST_EMAIL,
        motDePasse: TEST_PASSWORD
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Authentification réussie');
      return response.data.token;
    } else {
      console.error('❌ Erreur d\'authentification:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.message);
    return null;
  }
}

// Fonction pour tester la récupération des notifications
async function testGetNotifications(token, particulierId) {
  console.log(`🔔 Test récupération notifications pour particulier ${particulierId}...`);
  
  try {
    const response = await makeRequest(`${API_BASE_URL}/notifications/particulier/${particulierId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Notifications récupérées avec succès');
      console.log('📊 Données reçues:', {
        success: response.data.success,
        count: response.data.data?.length || 0,
        notifications: response.data.data?.map(n => ({
          id: n.id,
          type: n.type,
          contenu: n.contenu,
          statut: n.statut,
          dateEnvoi: n.dateEnvoi
        }))
      });
      
      return response.data;
    } else {
      console.error('❌ Erreur récupération notifications:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur récupération notifications:', error.message);
    return null;
  }
}

// Fonction pour tester le marquage comme lu
async function testMarkAsRead(token, notificationId) {
  console.log(`✅ Test marquage notification ${notificationId} comme lue...`);
  
  try {
    const response = await makeRequest(`${API_BASE_URL}/notifications/${notificationId}/lu`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Notification marquée comme lue');
      console.log('📊 Réponse:', response.data);
      return response.data;
    } else {
      console.error('❌ Erreur marquage comme lu:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur marquage comme lu:', error.message);
    return null;
  }
}

// Fonction pour tester le marquage de toutes comme lues
async function testMarkAllAsRead(token, particulierId) {
  console.log(`✅ Test marquage toutes les notifications comme lues pour particulier ${particulierId}...`);
  
  try {
    const response = await makeRequest(`${API_BASE_URL}/notifications/particulier/${particulierId}/lu-toutes`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Toutes les notifications marquées comme lues');
      console.log('📊 Réponse:', response.data);
      return response.data;
    } else {
      console.error('❌ Erreur marquage toutes comme lues:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur marquage toutes comme lues:', error.message);
    return null;
  }
}

// Fonction pour vérifier la structure de la base de données
async function checkDatabaseStructure() {
  console.log('🗄️ Vérification de la structure de la base de données...');
  
  try {
    // Vérifier le modèle Notification
    const notificationAttributes = Object.keys(Notification.rawAttributes);
    console.log('📋 Attributs du modèle Notification:', notificationAttributes);
    
    // Vérifier les associations
    const associations = Notification.associations;
    console.log('🔗 Associations du modèle Notification:', Object.keys(associations));
    
    // Vérifier les contraintes
    const tableName = Notification.tableName;
    console.log('📊 Nom de la table:', tableName);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur vérification structure DB:', error.message);
    return false;
  }
}

// Fonction pour créer des notifications de test
async function createTestNotifications(particulierId) {
  console.log(`📝 Création de notifications de test pour particulier ${particulierId}...`);
  
  try {
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
    
    return createdNotifications;
  } catch (error) {
    console.error('❌ Erreur création notifications de test:', error.message);
    return [];
  }
}

// Fonction pour nettoyer les notifications de test
async function cleanupTestNotifications(particulierId) {
  console.log(`🧹 Nettoyage des notifications de test pour particulier ${particulierId}...`);
  
  try {
    const deletedCount = await Notification.destroy({
      where: {
        particulierId: particulierId,
        contenu: {
          [require('sequelize').Op.like]: '%test%'
        }
      }
    });
    
    console.log(`✅ ${deletedCount} notifications de test supprimées`);
    return deletedCount;
  } catch (error) {
    console.error('❌ Erreur nettoyage notifications de test:', error.message);
    return 0;
  }
}

// Fonction principale de test
async function runConsistencyTests() {
  console.log('🚀 === TEST DE COHÉRENCE DES NOTIFICATIONS ===\n');
  
  // 1. Vérifier la structure de la base de données
  const dbStructureOk = await checkDatabaseStructure();
  if (!dbStructureOk) {
    console.error('❌ Structure de base de données invalide');
    return;
  }
  
  // 2. Tester l'authentification
  const token = await testAuth();
  if (!token) {
    console.error('❌ Impossible de s\'authentifier');
    return;
  }
  
  // 3. Récupérer l'ID du particulier de test
  let particulierId;
  try {
    const particulier = await Particulier.findOne({
      where: { email: TEST_EMAIL }
    });
    
    if (!particulier) {
      console.error('❌ Particulier de test non trouvé');
      return;
    }
    
    particulierId = particulier.id;
    console.log(`👤 Particulier de test trouvé: ${particulierId}`);
  } catch (error) {
    console.error('❌ Erreur récupération particulier:', error.message);
    return;
  }
  
  // 4. Créer des notifications de test
  const testNotifications = await createTestNotifications(particulierId);
  
  // 5. Tester la récupération des notifications
  const notificationsData = await testGetNotifications(token, particulierId);
  
  if (notificationsData && notificationsData.data && notificationsData.data.length > 0) {
    const firstNotification = notificationsData.data[0];
    
    // 6. Tester le marquage comme lu
    await testMarkAsRead(token, firstNotification.id);
    
    // 7. Tester le marquage de toutes comme lues
    await testMarkAllAsRead(token, particulierId);
    
    // 8. Vérifier que les changements sont bien pris en compte
    const updatedNotifications = await testGetNotifications(token, particulierId);
    if (updatedNotifications) {
      const unreadCount = updatedNotifications.data.filter(n => n.statut === 'non_lu').length;
      console.log(`📊 Nombre de notifications non lues après marquage: ${unreadCount}`);
    }
  }
  
  // 9. Nettoyer les notifications de test
  await cleanupTestNotifications(particulierId);
  
  console.log('\n✅ === TESTS DE COHÉRENCE TERMINÉS ===');
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runConsistencyTests()
    .then(() => {
      console.log('🎉 Tests terminés avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erreur lors des tests:', error);
      process.exit(1);
    });
}

module.exports = {
  runConsistencyTests,
  testAuth,
  testGetNotifications,
  testMarkAsRead,
  testMarkAllAsRead
}; 