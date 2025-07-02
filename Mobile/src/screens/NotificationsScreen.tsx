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
import { notificationService, Notification, handleApiError } from '../services/api';
import { storageService } from '../services/storage';

const NotificationsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Récupérer l'ID de l'utilisateur connecté
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        console.log('🔍 Récupération de l\'ID utilisateur...');
        const userId = await storageService.getUserId();
        console.log('👤 ID utilisateur récupéré:', userId);
        if (userId) {
          setUserId(userId);
        } else {
          console.warn('⚠️ Aucun ID utilisateur trouvé');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des informations utilisateur:', error);
      }
    };
    getUserInfo();
  }, []);

  // Récupérer les notifications
  const fetchNotifications = async () => {
    if (!userId) {
      console.warn('⚠️ Impossible de récupérer les notifications: userId manquant');
      return;
    }
    
    console.log('🔔 Début de la récupération des notifications pour userId:', userId);
    
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(userId);
      console.log('✅ Réponse API reçue:', response);
      setNotifications(response.data || []);
      console.log('📊 Notifications mises à jour:', response.data?.length || 0);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      Alert.alert(
        'Erreur',
        handleApiError(error),
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Marquer une notification comme lue
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, statut: 'lu' as const }
            : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      Alert.alert(
        'Erreur',
        handleApiError(error),
        [{ text: 'OK' }]
      );
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    if (!userId) return;
    
    try {
      await notificationService.markAllAsRead(userId);
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, statut: 'lu' as const }))
      );
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
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
    await fetchNotifications();
    setRefreshing(false);
  };

  // Charger les notifications quand l'userId est disponible
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

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
        showNotification={false}
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
});

export default NotificationsScreen; 