// Configuration de l'API selon l'environnement
const ENV = {
  development: {
    API_BASE_URL: 'http://192.168.1.98:3000/api', // IP de votre ordinateur pour accès mobile
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