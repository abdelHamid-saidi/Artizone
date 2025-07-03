import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  RefreshControl,
  Alert,
  ActivityIndicator 
} from 'react-native';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';
import { notificationService, profileService, Notification, handleApiError } from '../services/api';
import { storageService } from '../services/storage';

const NotificationsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: '',
    nom: '',
    email: '',
    telephone: '',
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const [useStandardNotifications, setUseStandardNotifications] = useState(false);

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      console.log('🔍 Récupération des informations utilisateur...');
      const token = await storageService.getAuthToken();
      const role = await storageService.getUserRole();
      const userId = await storageService.getUserId();
      
      if (token && role && userId) {
        console.log('✅ Utilisateur connecté trouvé:', { userId, role });
        
        // Récupérer les vraies informations utilisateur depuis l'API
        try {
          const profileResponse = await profileService.getProfile();
          const userData = profileResponse.user;
          
          setUserInfo({
            id: userData.id.toString(),
            nom: userData.nom,
            email: userData.email,
            telephone: userData.telephone || '',
          });
          
          console.log('✅ Profil utilisateur récupéré:', {
            id: userData.id,
            nom: userData.nom,
            email: userData.email
          });
        } catch (profileError) {
          console.warn('⚠️ Impossible de récupérer le profil, utilisation des données de base:', profileError);
          // Fallback avec les données de base
          setUserInfo({
            id: userId,
            nom: 'Utilisateur',
            email: 'user@example.com',
            telephone: '+33 6 12 34 56 78',
          });
        }
        
        // Charger les notifications une fois l'utilisateur identifié
        await fetchNotifications(userId);
      } else {
        console.warn('⚠️ Aucun utilisateur connecté trouvé');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des informations utilisateur:', error);
      setLoading(false);
    }
  };

  // Notifications standard en cas d'échec de l'API
  const getStandardNotifications = (): Notification[] => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);
    const twoHoursAgo = new Date(now.getTime() - 7200000);
    const oneDayAgo = new Date(now.getTime() - 86400000);
    
    return [
      {
        id: 'standard-1',
        type: 'reservation',
        contenu: 'Votre réservation avec l\'artisan Jean Dupont a été confirmée pour le 15/12/2024 à 14h00.',
        dateEnvoi: now.toISOString(),
        statut: 'non_lu',
        particulierId: userInfo.id || 'standard-user',
        administrateurId: undefined,
        Particulier: {
          id: userInfo.id || 'standard-user',
          nom: userInfo.nom || 'Utilisateur',
          email: userInfo.email || 'user@example.com'
        }
      },
      {
        id: 'standard-2',
        type: 'message',
        contenu: 'Nouveau message de l\'artisan Marie Martin concernant votre demande de devis pour la rénovation de votre salle de bain.',
        dateEnvoi: oneHourAgo.toISOString(),
        statut: 'non_lu',
        particulierId: userInfo.id || 'standard-user',
        administrateurId: undefined,
        Particulier: {
          id: userInfo.id || 'standard-user',
          nom: userInfo.nom || 'Utilisateur',
          email: userInfo.email || 'user@example.com'
        }
      },
      {
        id: 'standard-3',
        type: 'reminder',
        contenu: 'Rappel : Votre rendez-vous avec l\'artisan Pierre Durand est prévu demain à 10h00 pour l\'installation de votre cuisine.',
        dateEnvoi: twoHoursAgo.toISOString(),
        statut: 'lu',
        particulierId: userInfo.id || 'standard-user',
        administrateurId: undefined,
        Particulier: {
          id: userInfo.id || 'standard-user',
          nom: userInfo.nom || 'Utilisateur',
          email: userInfo.email || 'user@example.com'
        }
      },
      {
        id: 'standard-4',
        type: 'promo',
        contenu: '🎉 Offre spéciale ! 20% de réduction sur tous les services de plomberie ce mois-ci. Profitez-en !',
        dateEnvoi: oneDayAgo.toISOString(),
        statut: 'lu',
        particulierId: userInfo.id || 'standard-user',
        administrateurId: undefined,
        Particulier: {
          id: userInfo.id || 'standard-user',
          nom: userInfo.nom || 'Utilisateur',
          email: userInfo.email || 'user@example.com'
        }
      },
      {
        id: 'standard-5',
        type: 'commande',
        contenu: 'Votre commande de matériaux pour la rénovation a été expédiée. Numéro de suivi : ARTZ-2024-001.',
        dateEnvoi: oneDayAgo.toISOString(),
        statut: 'lu',
        particulierId: userInfo.id || 'standard-user',
        administrateurId: undefined,
        Particulier: {
          id: userInfo.id || 'standard-user',
          nom: userInfo.nom || 'Utilisateur',
          email: userInfo.email || 'user@example.com'
        }
      }
    ];
  };

  // Récupérer les notifications
  const fetchNotifications = async (userId?: string) => {
    const targetUserId = userId || userInfo.id;
    
    if (!targetUserId) {
      console.warn('⚠️ Impossible de récupérer les notifications: userId manquant');
      setLoading(false);
      return;
    }
    
    console.log('🔔 Début de la récupération des notifications pour userId:', targetUserId);
    
    try {
      setLoading(true);
      setUseStandardNotifications(false); // Réinitialiser le flag
      
      const response = await notificationService.getNotifications(targetUserId);
      console.log('✅ Réponse API reçue:', response);
      
      const notificationsData = response.data || [];
      setNotifications(notificationsData);
      
      // Calculer le nombre de notifications non lues
      const unreadNotifications = notificationsData.filter(notif => notif.statut === 'non_lu');
      setUnreadCount(unreadNotifications.length);
      
      console.log('📊 Notifications mises à jour:', {
        total: notificationsData.length,
        unread: unreadNotifications.length
      });
      
      // Afficher un message si aucune notification
      if (notificationsData.length === 0) {
        console.log('ℹ️ Aucune notification trouvée pour cet utilisateur');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      
      // Gestion spécifique des erreurs
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('401') || errorMessage.includes('non autorisé')) {
        Alert.alert(
          'Session expirée',
          'Votre session a expiré. Veuillez vous reconnecter.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Rediriger vers la page de connexion
                navigation.navigate('Login');
              }
            }
          ]
        );
      } else {
        // Utiliser les notifications standard en cas d'erreur
        console.log('🔄 Utilisation des notifications standard en raison de l\'erreur API');
        const standardNotifications = getStandardNotifications();
        setNotifications(standardNotifications);
        setUseStandardNotifications(true);
        
        const unreadStandardNotifications = standardNotifications.filter(notif => notif.statut === 'non_lu');
        setUnreadCount(unreadStandardNotifications.length);
        
        console.log('📊 Notifications standard chargées:', {
          total: standardNotifications.length,
          unread: unreadStandardNotifications.length
        });
        
        // Afficher une alerte informant l'utilisateur
        Alert.alert(
          'Mode hors ligne',
          'Impossible de récupérer les notifications depuis le serveur. Affichage des notifications de démonstration.',
          [
            { text: 'Réessayer', onPress: () => fetchNotifications(targetUserId) },
            { text: 'Continuer', onPress: () => {} }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    try {
      // Si c'est une notification standard, pas besoin d'appeler l'API
      if (notificationId.startsWith('standard-')) {
        console.log('📝 Marquage notification standard comme lue:', notificationId);
        // Mettre à jour l'état local
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, statut: 'lu' as const }
              : notif
          )
        );
        
        // Mettre à jour le compteur de notifications non lues
        setUnreadCount(prev => Math.max(0, prev - 1));
        return;
      }
      
      // Appel API pour les vraies notifications
      await notificationService.markAsRead(notificationId);
      console.log('✅ Notification marquée comme lue via API:', notificationId);
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, statut: 'lu' as const }
            : notif
        )
      );
      
      // Mettre à jour le compteur de notifications non lues
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      
      // En cas d'erreur API, marquer quand même localement
      if (!notificationId.startsWith('standard-')) {
        console.log('🔄 Marquage local en raison de l\'erreur API');
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, statut: 'lu' as const }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      Alert.alert(
        'Erreur',
        handleApiError(error),
        [{ text: 'OK' }]
      );
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    if (!userInfo.id) return;
    
    try {
      // Si on utilise des notifications standard, marquer localement
      if (useStandardNotifications) {
        console.log('📝 Marquage de toutes les notifications standard comme lues');
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, statut: 'lu' as const }))
        );
        setUnreadCount(0);
        return;
      }
      
      // Appel API pour les vraies notifications
      await notificationService.markAllAsRead(userInfo.id);
      console.log('✅ Toutes les notifications marquées comme lues via API');
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, statut: 'lu' as const }))
      );
      
      // Réinitialiser le compteur de notifications non lues
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      
      // En cas d'erreur API, marquer quand même localement
      console.log('🔄 Marquage local de toutes les notifications en raison de l\'erreur API');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, statut: 'lu' as const }))
      );
      setUnreadCount(0);
      
      Alert.alert(
        'Erreur',
        handleApiError(error),
        [{ text: 'OK' }]
      );
    }
  };

  // Fonction de rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Recharger les informations utilisateur et les notifications
      await loadUserInfo();
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Obtenir l'icône selon le type de notification
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return 'check-circle';
      case 'message':
        return 'message';
      case 'reminder':
        return 'schedule';
      case 'promo':
        return 'local-offer';
      case 'commande':
        return 'shopping-cart';
      case 'paiement':
        return 'payment';
      default:
        return 'notifications';
    }
  };

  // Obtenir la couleur selon le type de notification
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reservation':
        return '#4CAF50';
      case 'message':
        return '#2196F3';
      case 'reminder':
        return '#FF9800';
      case 'promo':
        return '#E91E63';
      case 'commande':
        return '#9C27B0';
      case 'paiement':
        return '#00BCD4';
      default:
        return '#757575';
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Il y a ${diffInDays}j`;
    }
  };

  // Afficher le contenu principal
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement des notifications...</Text>
        </View>
      );
    }

    if (notifications.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Aucune notification</Text>
          <Text style={styles.emptyText}>Vous n'avez pas encore reçu de notifications</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Indicateur de mode hors ligne */}
        {useStandardNotifications && (
          <View style={styles.offlineIndicator}>
            <MaterialIcons name="wifi-off" size={16} color={colors.warning} />
            <Text style={styles.offlineText}>Mode hors ligne - Notifications de démonstration</Text>
          </View>
        )}

        {/* Bouton pour marquer toutes comme lues */}
        {notifications.some(n => n.statut === 'non_lu') && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <MaterialIcons name="done-all" size={20} color={colors.primary} />
            <Text style={styles.markAllText}>Marquer toutes comme lues</Text>
          </TouchableOpacity>
        )}

        {/* Liste des notifications */}
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              notification.statut === 'non_lu' && styles.unreadNotification
            ]}
            onPress={() => markAsRead(notification.id)}
            activeOpacity={0.7}
          >
            <View style={styles.notificationIcon}>
              <MaterialIcons
                name={getNotificationIcon(notification.type) as any}
                size={24}
                color={getNotificationColor(notification.type)}
              />
            </View>
            
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText} numberOfLines={3}>
                {notification.contenu}
              </Text>
              <Text style={styles.notificationDate}>
                {formatDate(notification.dateEnvoi)}
              </Text>
            </View>

            {notification.statut === 'non_lu' && (
              <View style={styles.unreadIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Notifications"
        showBack={true}
        onBack={() => navigation.goBack()}
        showNotification={true}
        notificationCount={unreadCount}
        onNotificationPress={() => {
          // Si on est déjà sur l'écran des notifications, on peut rafraîchir
          onRefresh();
        }}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  markAllText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unreadNotification: {
    backgroundColor: colors.background,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
    marginTop: 4,
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
});

export default NotificationsScreen; 