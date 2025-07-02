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

export interface AuthResponse {
  token: string;
  role: 'particulier' | 'admin';
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
}

// Fonction utilitaire pour faire des requêtes API avec timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout: number = API_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Service d'authentification
export const authService = {
  // ===== AUTHENTIFICATION PARTICULIER =====
  
  // Connexion particulier
  loginParticulier: async (credentials: LoginCredentials): Promise<AuthResponse> => {
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
        throw new Error(errorData.error || 'Erreur de connexion particulier');
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  // Inscription particulier
  registerParticulier: async (userData: RegisterData): Promise<RegisterResponse> => {
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
        throw new Error(errorData.error || 'Erreur d\'inscription particulier');
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  // ===== AUTHENTIFICATION ADMINISTRATEUR =====
  
  // Connexion administrateur
  loginAdmin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
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
        throw new Error(errorData.error || 'Erreur de connexion administrateur');
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  // Inscription administrateur
  registerAdmin: async (userData: RegisterData): Promise<RegisterResponse> => {
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
        throw new Error(errorData.error || 'Erreur d\'inscription administrateur');
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  // ===== FONCTIONS LEGACY (pour compatibilité) =====
  
  // Connexion mixte (legacy - à déprécier)
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
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
        throw new Error(errorData.error || 'Erreur de connexion');
      }

      return await response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      throw error;
    }
  },

  // Inscription (particulier par défaut - legacy)
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    return authService.registerParticulier(userData);
  },
};

// Fonction utilitaire pour gérer les erreurs réseau
export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message;
  }
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
  }
  return 'Une erreur inattendue s\'est produite.';
}; 