// Configuration de l'API selon l'environnement
const ENV = {
  development: {
    // Configuration flexible pour le développement
    // Adresse IP locale détectée automatiquement
    API_BASE_URL: 'http://172.20.10.2:3000/api',
    
    // Alternatives (décommentez si nécessaire):
    // API_BASE_URL: 'http://localhost:3000/api', // Pour test sur le même appareil
    // API_BASE_URL: 'http://10.92.4.40:3000/api', // Ancienne IP
  },
  production: {
    API_BASE_URL: 'https://votre-domaine.com/api', // À remplacer par votre URL de production
  },
  staging: {
    API_BASE_URL: 'https://staging.votre-domaine.com/api', // À remplacer par votre URL de staging
  },
};

// Détection automatique de l'environnement
const getEnvironment = () => {
  if (__DEV__) {
    return 'development';
  }
  // Vous pouvez ajouter d'autres conditions pour détecter staging/production
  return 'production';
};

export const API_CONFIG = ENV[getEnvironment()];

// Timeout pour les requêtes API (en millisecondes)
export const API_TIMEOUT = 10000;

// Headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Fonction utilitaire pour obtenir l'URL de l'API
export const getApiUrl = (endpoint: string = '') => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

// Log de la configuration pour debug
if (__DEV__) {
  console.log('🔧 Configuration API:', {
    environment: getEnvironment(),
    baseUrl: API_CONFIG.API_BASE_URL,
    timeout: API_TIMEOUT
  });
} 