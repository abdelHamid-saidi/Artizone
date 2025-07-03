import { API_CONFIG, API_TIMEOUT, DEFAULT_HEADERS } from '../config/api';
import { storageService } from './storage';

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

// Types pour les notifications
export interface Notification {
  id: string;
  type: string;
  contenu: string;
  dateEnvoi: string;
  statut: 'lu' | 'non_lu';
  particulierId: string;
  administrateurId?: string;
  Particulier?: {
    id: string;
    nom: string;
    email: string;
  };
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export interface NotificationUpdateResponse {
  success: boolean;
  message: string;
  data?: Notification;
}

// Types pour les catégories
export interface Categorie {
  id: string;
  nom: string;
  description?: string;
  icone?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Categorie[];
}

// Types pour les artisans
export interface Artisan {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  description?: string;
  note?: number;
  nombreAvis?: number;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  categories?: Categorie[];
  services?: Service[];
}

export interface Service {
  id: string;
  nom: string;
  description: string;
  prix: number;
  duree: number;
  categorieId: string;
}

export interface ArtisansResponse {
  success: boolean;
  data: Artisan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Fonctions utilitaires pour générer des données aléatoires
const generateRandomPrice = (): number => {
  // Prix entre 20€ et 200€
  return Math.floor(Math.random() * 180) + 20;
};

const generateRandomRating = (): number => {
  // Note entre 3.0 et 5.0 avec une décimale
  return Math.round((Math.random() * 2 + 3) * 10) / 10;
};

const generateRandomReviewCount = (): number => {
  // Nombre d'avis entre 5 et 50
  return Math.floor(Math.random() * 45) + 5;
};

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

// ===== SERVICE DE PROFIL =====

// Types pour le profil
export interface ProfileData {
  nom?: string;
  email?: string;
  telephone?: string;
}

export interface ProfileResponse {
  user: {
    id: string | number;
    nom: string;
    email: string;
    telephone?: string;
    role: 'particulier' | 'admin';
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    id: string | number;
    nom: string;
    email: string;
    telephone?: string;
    role: 'particulier' | 'admin';
    updatedAt: string;
  };
}

export interface ChangePasswordData {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

// Fonction utilitaire pour obtenir le token d'authentification
const getAuthToken = async (): Promise<string> => {
  try {
    const token = await storageService.getAuthToken();
    if (!token) {
      throw new Error('Token d\'authentification non trouvé');
    }
    return token;
  } catch (error) {
    console.error('❌ Erreur récupération token:', error);
    throw new Error('Session expirée. Veuillez vous reconnecter.');
  }
};

// Service de profil
export const profileService = {
  // Récupérer le profil utilisateur
  getProfile: async (): Promise<ProfileResponse> => {
    console.log('👤 === RÉCUPÉRATION PROFIL ===');
    
    try {
      const token = await getAuthToken();
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/auth/profile`,
        {
          method: 'GET',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors de la récupération du profil');
      }

      const data = await response.json();
      console.log('✅ Profil récupéré avec succès:', {
        userId: data.user?.id,
        nom: data.user?.nom,
        role: data.user?.role
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de récupération profil');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur récupération profil:', error);
      throw error;
    }
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (profileData: ProfileData): Promise<UpdateProfileResponse> => {
    console.log('✏️ === MISE À JOUR PROFIL ===');
    console.log('📝 Données à mettre à jour:', {
      nom: profileData.nom,
      email: profileData.email,
      telephone: profileData.telephone
    });
    
    try {
      const token = await getAuthToken();
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/auth/profile`,
        {
          method: 'PUT',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profileData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du profil');
      }

      const data = await response.json();
      console.log('✅ Profil mis à jour avec succès:', {
        message: data.message,
        userId: data.user?.id,
        nom: data.user?.nom
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de mise à jour profil');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur mise à jour profil:', error);
      throw error;
    }
  },

  // Changer le mot de passe
  changePassword: async (passwordData: ChangePasswordData): Promise<{ message: string }> => {
    console.log('🔐 === CHANGEMENT MOT DE PASSE ===');
    console.log('📝 Données reçues:', {
      ancienMotDePasse: passwordData.ancienMotDePasse ? '[MASQUÉ]' : 'NON_FOURNI',
      nouveauMotDePasse: passwordData.nouveauMotDePasse ? '[MASQUÉ]' : 'NON_FOURNI'
    });
    
    try {
      const token = await getAuthToken();
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/auth/profile/password`,
        {
          method: 'PUT',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(passwordData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors du changement de mot de passe');
      }

      const data = await response.json();
      console.log('✅ Mot de passe changé avec succès:', {
        message: data.message
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de changement mot de passe');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur changement mot de passe:', error);
      throw error;
    }
  },
};

// Service de notifications
export const notificationService = {
  // Récupérer toutes les notifications d'un particulier
  getNotifications: async (particulierId: string): Promise<NotificationsResponse> => {
    console.log('🔔 === RÉCUPÉRATION NOTIFICATIONS ===');
    console.log('👤 Particulier ID:', particulierId);
    
    try {
      const token = await getAuthToken();
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/notifications/particulier/${particulierId}`,
        {
          method: 'GET',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors de la récupération des notifications');
      }

      const data = await response.json();
      console.log('✅ Notifications récupérées avec succès:', {
        count: data.data?.length || 0,
        success: data.success
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de récupération notifications');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur récupération notifications:', error);
      throw error;
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId: string): Promise<NotificationUpdateResponse> => {
    console.log('✅ === MARQUER NOTIFICATION COMME LUE ===');
    console.log('🔔 Notification ID:', notificationId);
    
    try {
      const token = await getAuthToken();
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/notifications/${notificationId}/lu`,
        {
          method: 'PATCH',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la notification');
      }

      const data = await response.json();
      console.log('✅ Notification marquée comme lue:', {
        message: data.message,
        success: data.success
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de mise à jour notification');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur mise à jour notification:', error);
      throw error;
    }
  },

  // Marquer toutes les notifications d'un particulier comme lues
  markAllAsRead: async (particulierId: string): Promise<{ success: boolean; message: string }> => {
    console.log('✅ === MARQUER TOUTES LES NOTIFICATIONS COMME LUES ===');
    console.log('👤 Particulier ID:', particulierId);
    
    try {
      const token = await getAuthToken();
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/notifications/particulier/${particulierId}/lu-toutes`,
        {
          method: 'PATCH',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors de la mise à jour des notifications');
      }

      const data = await response.json();
      console.log('✅ Toutes les notifications marquées comme lues:', {
        message: data.message,
        success: data.success
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de mise à jour notifications');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur mise à jour notifications:', error);
      throw error;
    }
  },
};

// Service des catégories
export const categorieService = {
  // Récupérer toutes les catégories
  getCategories: async (): Promise<CategoriesResponse> => {
    console.log('🏷️ === RÉCUPÉRATION CATÉGORIES ===');
    
    try {
      const token = await getAuthToken();
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/categories`,
        {
          method: 'GET',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors de la récupération des catégories');
      }

      const data = await response.json();
      console.log('✅ Catégories récupérées avec succès:', {
        count: data.data?.length || 0,
        success: data.success
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de récupération catégories');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur récupération catégories:', error);
      throw error;
    }
  },
};

// Service des artisans
export const artisanService = {
  // Récupérer les artisans avec pagination et filtres
  getArtisans: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    categorieId?: string
  ): Promise<ArtisansResponse> => {
    console.log('👨‍🔧 === RÉCUPÉRATION ARTISANS ===');
    console.log('📄 Page:', page);
    console.log('📊 Limite:', limit);
    console.log('🔍 Recherche:', search || 'Aucune');
    console.log('🏷️ Catégorie:', categorieId || 'Toutes');
    
    try {
      const token = await getAuthToken();
      
      // Construire les paramètres de requête
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (categorieId) params.append('categorieId', categorieId);
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/artisans?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors de la récupération des artisans');
      }

      const data = await response.json();
      
      // Ajouter des prix aléatoires aux services et des notes aléatoires aux artisans
      if (data.data && Array.isArray(data.data)) {
        data.data = data.data.map((artisan: Artisan) => ({
          ...artisan,
          note: artisan.note || generateRandomRating(),
          nombreAvis: artisan.nombreAvis || generateRandomReviewCount(),
          services: artisan.services?.map((service: Service) => ({
            ...service,
            prix: service.prix || generateRandomPrice()
          })) || []
        }));
      }
      
      console.log('✅ Artisans récupérés avec succès:', {
        count: data.data?.length || 0,
        total: data.pagination?.total || 0,
        page: data.pagination?.page || 1,
        totalPages: data.pagination?.totalPages || 1,
        success: data.success
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de récupération artisans');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur récupération artisans:', error);
      throw error;
    }
  },

  // Récupérer un artisan par ID
  getArtisanById: async (artisanId: string): Promise<{ success: boolean; data: Artisan }> => {
    console.log('👨‍🔧 === RÉCUPÉRATION ARTISAN PAR ID ===');
    console.log('🆔 Artisan ID:', artisanId);
    
    try {
      const token = await getAuthToken();
      
      const response = await fetchWithTimeout(
        `${API_CONFIG.API_BASE_URL}/artisans/${artisanId}`,
        {
          method: 'GET',
          headers: {
            ...DEFAULT_HEADERS,
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', {
          status: response.status,
          error: errorData
        });
        throw new Error(errorData.error || 'Erreur lors de la récupération de l\'artisan');
      }

      const data = await response.json();
      
      // Ajouter des prix aléatoires aux services et des notes aléatoires à l'artisan
      if (data.data) {
        data.data = {
          ...data.data,
          note: data.data.note || generateRandomRating(),
          nombreAvis: data.data.nombreAvis || generateRandomReviewCount(),
          services: data.data.services?.map((service: Service) => ({
            ...service,
            prix: service.prix || generateRandomPrice()
          })) || []
        };
      }
      
      console.log('✅ Artisan récupéré avec succès:', {
        nom: data.data?.nom,
        success: data.success
      });
      
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('⏰ Timeout de la requête de récupération artisan');
        throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion internet.');
      }
      console.error('❌ Erreur récupération artisan:', error);
      throw error;
    }
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