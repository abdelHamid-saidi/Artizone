import { API_CONFIG, API_TIMEOUT, DEFAULT_HEADERS } from '../config/api';

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  motDePasse: string;
}

export interface RegisterData {
  nom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
}

export interface UserInfo {
  id: string | number;
  nom: string;
  email: string;
  telephone?: string;
}

export interface AuthResponse {
  token: string;
  role: 'particulier' | 'admin';
  user: UserInfo;
}

export interface RegisterResponse {
  message: string;
  token: string;
  role: 'particulier' | 'admin';
  user: UserInfo;
}

// Fonction utilitaire pour faire des requêtes API avec timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = API_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  console.log('🌐 === REQUÊTE HTTP ===');
  console.log('📡 URL:', url);
  console.log('🔧 Méthode:', options.method || 'GET');
  console.log('⏱️ Timeout:', timeout, 'ms');
  console.log('📋 Headers:', options.headers);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    console.log('📥 Réponse reçue:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ Erreur requête:', error);
    throw error;
  }
};

// Service d'authentification
export const authService = {
  // ===== AUTHENTIFICATION PARTICULIER =====
  
  // Connexion particulier
  loginParticulier: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔐 === CONNEXION PARTICULIER ===');
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Mot de passe:', credentials.motDePasse ? '[MASQUÉ]' : 'NON_FOURNI');
    
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/auth/particulier/login`,
        {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur de connexion particulier');
      }

      const data = await response.json();
      console.log('✅ Connexion réussie:', {
        role: data.role,
        userId: data.user?.id,
        hasToken: !!data.token
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de connexion');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur connexion particulier:', error);
      throw error;
    }
  },

  // Inscription particulier
  registerParticulier: async (userData: RegisterData): Promise<RegisterResponse> => {
    console.log('📝 === INSCRIPTION PARTICULIER ===');
    console.log('👤 Nom:', userData.nom);
    console.log('📧 Email:', userData.email);
    console.log('📱 Téléphone:', userData.telephone || 'NON_FOURNI');
    console.log('🔑 Mot de passe:', userData.motDePasse ? '[MASQUÉ]' : 'NON_FOURNI');
    
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/auth/particulier/register`,
        {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur d\'inscription particulier');
      }

      const data = await response.json();
      console.log('✅ Inscription réussie:', {
        message: data.message,
        role: data.role,
        userId: data.user?.id,
        hasToken: !!data.token
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête d\'inscription');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur inscription particulier:', error);
      throw error;
    }
  },

  // ===== AUTHENTIFICATION ADMINISTRATEUR =====
  
  // Connexion administrateur
  loginAdmin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('👨‍💼 === CONNEXION ADMINISTRATEUR ===');
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Mot de passe:', credentials.motDePasse ? '[MASQUÉ]' : 'NON_FOURNI');
    
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/auth/admin/login`,
        {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur de connexion administrateur');
      }

      const data = await response.json();
      console.log('✅ Connexion admin réussie:', {
        role: data.role,
        userId: data.user?.id,
        hasToken: !!data.token
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de connexion admin');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur connexion admin:', error);
      throw error;
    }
  },

  // Inscription administrateur
  registerAdmin: async (userData: RegisterData): Promise<RegisterResponse> => {
    console.log('👨‍💼 === INSCRIPTION ADMINISTRATEUR ===');
    console.log('👤 Nom:', userData.nom);
    console.log('📧 Email:', userData.email);
    console.log('🔑 Mot de passe:', userData.motDePasse ? '[MASQUÉ]' : 'NON_FOURNI');
    
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/auth/admin/register`,
        {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur d\'inscription administrateur');
      }

      const data = await response.json();
      console.log('✅ Inscription admin réussie:', {
        message: data.message,
        role: data.role,
        userId: data.user?.id,
        hasToken: !!data.token
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête d\'inscription admin');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur inscription admin:', error);
      throw error;
    }
  },

  // ===== FONCTIONS LEGACY (pour compatibilité) =====
  
  // Connexion mixte (legacy - à déprécier)
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log('🔄 === CONNEXION MIXTE (LEGACY) ===');
    console.log('📧 Email:', credentials.email);
    console.log('🔑 Mot de passe:', credentials.motDePasse ? '[MASQUÉ]' : 'NON_FOURNI');
    
    try {
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur de connexion');
      }

      const data = await response.json();
      console.log('✅ Connexion mixte réussie:', {
        role: data.role,
        userId: data.user?.id,
        hasToken: !!data.token
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de connexion mixte');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur connexion mixte:', error);
      throw error;
    }
  },

  // Inscription (particulier par défaut - legacy)
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    console.log('🔄 === INSCRIPTION LEGACY (redirection vers particulier) ===');
    return authService.registerParticulier(userData);
  },
};

// Fonction utilitaire pour gérer les erreurs réseau
export const handleApiError = (error: any): string => {
  console.log('🔍 === ANALYSE ERREUR API ===');
  console.log('❌ Type d\'erreur:', error.name);
  console.log('❌ Message:', error.message);
  
  if (error.message) {
    // Erreurs spécifiques de l'API
    if (error.message.includes('Email ou mot de passe incorrect')) {
      return 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
    }
    if (error.message.includes('Cette adresse email est déjà utilisée')) {
      return 'Cette adresse email est déjà utilisée.';
    }
    if (error.message.includes('Données invalides')) {
      return 'Données invalides. Veuillez vérifier les informations saisies.';
    }
    if (error.message.includes('Délai d\'attente dépassé')) {
      return 'Connexion lente. Vérifiez votre connexion internet et réessayez.';
    }
    
    return error.message;
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    console.error('🌐 Erreur réseau détectée');
    return 'Erreur de connexion au serveur. Vérifiez votre connexion internet et que l\'API est démarrée.';
  }
  
  if (error.name === 'AbortError') {
    console.error('⏰ Timeout détecté');
    return 'La requête a pris trop de temps. Vérifiez votre connexion internet.';
  }
  
  console.error('❓ Erreur inconnue');
  return 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
}; 