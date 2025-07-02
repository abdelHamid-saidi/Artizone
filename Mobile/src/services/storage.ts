import AsyncStorage from '@react-native-async-storage/async-storage';

// Clés de stockage
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_ROLE: 'user_role',
  USER_ID: 'user_id',
};

// Service de stockage local
export const storageService = {
  // Sauvegarder le token d'authentification
  saveAuthToken: async (token: string, role: string, userId?: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
      if (userId) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  },

  // Récupérer le token d'authentification
  getAuthToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  },

  // Récupérer le rôle de l'utilisateur
  getUserRole: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle:', error);
      return null;
    }
  },

  // Récupérer l'ID de l'utilisateur
  getUserId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
      return null;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      return token !== null;
    } catch (error) {
      console.error('Erreur lors de la vérification d\'authentification:', error);
      return false;
    }
  },

  // Supprimer les données d'authentification (déconnexion)
  clearAuthData: async () => {
    try {
      console.log('🗑️ Suppression des données d\'authentification...');
      
      // Supprimer toutes les données d'authentification
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_ROLE,
        STORAGE_KEYS.USER_ID,
      ]);
      
      // Vérifier que la suppression a bien fonctionné
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const role = await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
      const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
      
      if (token === null && role === null && userId === null) {
        console.log('✅ Données d\'authentification supprimées avec succès');
        return true;
      } else {
        console.log('❌ Erreur: certaines données n\'ont pas été supprimées');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression des données d\'authentification:', error);
      throw error;
    }
  },

  // Fonction de déconnexion complète
  logout: async () => {
    try {
      console.log('🚪 Déconnexion en cours...');
      const success = await storageService.clearAuthData();
      
      if (success) {
        console.log('✅ Déconnexion réussie');
        return true;
      } else {
        console.log('❌ Échec de la déconnexion');
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      return false;
    }
  },
}; 