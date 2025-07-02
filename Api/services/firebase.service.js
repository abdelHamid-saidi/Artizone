const admin = require('firebase-admin');

let firebaseApp = null;

// Configuration Firebase depuis les variables d'environnement
const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Vérifier que toutes les variables d'environnement nécessaires sont présentes
  const requiredEnvVars = [
    'FIREBASE_TYPE',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Variables Firebase manquantes: ${missingVars.join(', ')}`);
    console.warn('Le service Firebase ne sera pas initialisé');
    return null;
  }

  try {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    console.log('✅ Service Firebase initialisé avec succès');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase:', error.message);
    return null;
  }
};

exports.sendNotification = async (token, title, body, data = {}) => {
  try {
    const app = initializeFirebase();
    if (!app) {
      throw new Error('Firebase n\'est pas configuré');
    }

    const message = {
      notification: { 
        title, 
        body 
      },
      data,
      token
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification envoyée avec succès:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de notification:', error.message);
    throw error;
  }
};

exports.sendNotificationToTopic = async (topic, title, body, data = {}) => {
  try {
    const app = initializeFirebase();
    if (!app) {
      throw new Error('Firebase n\'est pas configuré');
    }

    const message = {
      notification: { 
        title, 
        body 
      },
      data,
      topic
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification de topic envoyée avec succès:', response);
    return response;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de notification de topic:', error.message);
    throw error;
  }
};

exports.isFirebaseConfigured = () => {
  return firebaseApp !== null;
}; 