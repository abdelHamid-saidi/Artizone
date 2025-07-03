// Configuration de l'API pour l'application Web
const API_CONFIG = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
  },
  production: {
    API_BASE_URL: 'https://votre-domaine.com/api', // À remplacer par votre URL de production
  },
};

// Détection automatique de l'environnement
const getEnvironment = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }
  return 'production';
};

export const API_BASE_URL = API_CONFIG[getEnvironment()].API_BASE_URL;

// Timeout pour les requêtes API (en millisecondes)
export const API_TIMEOUT = 10000;

// Headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Fonction utilitaire pour obtenir l'URL de l'API
export const getApiUrl = (endpoint = '') => {
  return `${API_BASE_URL}${endpoint}`;
};

// Log de la configuration pour debug
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Configuration API Web:', {
    environment: getEnvironment(),
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT
  });
}
