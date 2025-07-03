import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Image,
  FlatList
} from 'react-native';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { storageService } from '../services/storage';
import { 
  artisanService, 
  categorieService, 
  notificationService,
  Artisan,
  Categorie,
  Notification,
  handleApiError
} from '../services/api';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';

const HomeScreen = ({ navigation }: any) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [popularArtisans, setPopularArtisans] = useState<Artisan[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalServices: 0,
    totalAvis: 0,
    unreadNotifications: 0
  });

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      console.log('🔍 Chargement des informations utilisateur...');
      const token = await storageService.getAuthToken();
      const role = await storageService.getUserRole();
      const userId = await storageService.getUserId();
      
      if (token && role && userId) {
        console.log('✅ Utilisateur connecté trouvé:', { userId, role });
        setUserInfo({ token, role, userId });
        
        // Charger toutes les données une fois l'utilisateur identifié
        await loadAllData();
      } else {
        console.warn('⚠️ Aucun utilisateur connecté trouvé');
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('❌ Erreur chargement utilisateur:', error);
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      console.log('📊 Chargement de toutes les données...');
      
      // Charger les données en parallèle
      const [
        artisansResponse,
        categoriesResponse,
        notificationsResponse
      ] = await Promise.allSettled([
        artisanService.getArtisans(1, 5), // 5 artisans populaires
        categorieService.getCategories(),
        notificationService.getNotifications(userInfo.userId)
      ]);

      // Traiter les artisans populaires
      if (artisansResponse.status === 'fulfilled') {
        setPopularArtisans(artisansResponse.value.data || []);
        setStats(prev => ({ ...prev, totalServices: artisansResponse.value.data?.length || 0 }));
      }

      // Traiter les catégories
      if (categoriesResponse.status === 'fulfilled') {
        setCategories(categoriesResponse.value.data || []);
      }

      // Traiter les notifications
      if (notificationsResponse.status === 'fulfilled') {
        const notifications = notificationsResponse.value.data || [];
        setRecentNotifications(notifications.slice(0, 3)); // 3 notifications récentes
        const unreadCount = notifications.filter(n => n.statut === 'non_lu').length;
        setStats(prev => ({ 
          ...prev, 
          unreadNotifications: unreadCount 
        }));
      }

      console.log('✅ Toutes les données chargées avec succès');
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await storageService.logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleArtisans = () => {
    navigation.navigate('Artisan');
  };

  const handleReservations = () => {
    navigation.navigate('Reservation');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleCategoryPress = (category: Categorie) => {
    navigation.navigate('Artisan', { selectedCategory: category.id });
  };

  const handleArtisanPress = (artisan: Artisan) => {
    console.log('👨‍🔧 Navigation vers artisan:', artisan.id);
    // navigation.navigate('ArtisanDetail', { artisanId: artisan.id });
  };

  // Rendu d'un artisan populaire
  const renderPopularArtisan = ({ item }: { item: Artisan }) => (
    <TouchableOpacity
      style={styles.artisanCard}
      onPress={() => handleArtisanPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.artisanHeader}>
        <View style={styles.artisanAvatar}>
          <Text style={styles.artisanInitials}>
            {item.nom.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </Text>
        </View>
        <View style={styles.artisanInfo}>
          <Text style={styles.artisanName} numberOfLines={1}>{item.nom}</Text>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>
              {item.note ? item.note.toFixed(1) : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      {item.categories && item.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          {item.categories.slice(0, 2).map((category) => (
            <View key={category.id} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category.nom}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  // Rendu d'une catégorie
  const renderCategory = ({ item }: { item: Categorie }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryIcon}>
        <MaterialIcons name="category" size={24} color={colors.primary} />
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>{item.nom}</Text>
    </TouchableOpacity>
  );

  // Rendu d'une notification
  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotifications()}
      activeOpacity={0.7}
    >
      <View style={styles.notificationIcon}>
        <MaterialIcons 
          name={item.type === 'reservation' ? 'event' : 'notifications'} 
          size={20} 
          color={colors.primary} 
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText} numberOfLines={2}>
          {item.contenu}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.dateEnvoi).toLocaleDateString('fr-FR')}
        </Text>
      </View>
      {item.statut === 'non_lu' && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Accueil"
        showBack={false}
        showNotification={true}
        notificationCount={stats.unreadNotifications}
        onNotificationPress={handleNotifications}
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Section de bienvenue */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeText}>
              Bonjour {userInfo?.role === 'particulier' ? '👋' : '👨‍💼'} !
            </Text>
            <Text style={styles.welcomeSubtext}>
              Que souhaitez-vous faire aujourd'hui ?
            </Text>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={handleArtisans}>
              <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                <MaterialIcons name="people" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Trouver un artisan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleReservations}>
              <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
                <MaterialIcons name="event" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Mes réservations</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleProfile}>
              <View style={[styles.actionIcon, { backgroundColor: colors.info }]}>
                <Feather name="user" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Mon profil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleNotifications}>
              <View style={[styles.actionIcon, { backgroundColor: colors.warning }]}>
                <MaterialIcons name="notifications" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes statistiques</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="event" size={24} color={colors.primary} />
              <Text style={styles.statNumber}>{stats.totalReservations}</Text>
              <Text style={styles.statLabel}>Réservations</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="build" size={24} color={colors.success} />
              <Text style={styles.statNumber}>{stats.totalServices}</Text>
              <Text style={styles.statLabel}>Services utilisés</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="star" size={24} color={colors.warning} />
              <Text style={styles.statNumber}>{stats.totalAvis}</Text>
              <Text style={styles.statLabel}>Avis donnés</Text>
            </View>
          </View>
        </View>

        {/* Catégories populaires */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Catégories populaires</Text>
            <FlatList
              data={categories.slice(0, 6)}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        )}

        {/* Artisans populaires */}
        {popularArtisans.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Artisans populaires</Text>
              <TouchableOpacity onPress={handleArtisans}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={popularArtisans}
              renderItem={renderPopularArtisan}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.artisansList}
            />
          </View>
        )}

        {/* Notifications récentes */}
        {recentNotifications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Notifications récentes</Text>
              <TouchableOpacity onPress={handleNotifications}>
                <Text style={styles.seeAllText}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.notificationsContainer}>
              {recentNotifications.map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <MaterialIcons 
                      name={notification.type === 'reservation' ? 'event' : 'notifications'} 
                      size={20} 
                      color={colors.primary} 
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationText} numberOfLines={2}>
                      {notification.contenu}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {new Date(notification.dateEnvoi).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  {notification.statut === 'non_lu' && (
                    <View style={styles.unreadIndicator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    width: 100,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  artisansList: {
    paddingRight: 20,
  },
  artisanCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 200,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  artisanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  artisanAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  artisanInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '500',
  },
  notificationsContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
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
  notificationTime: {
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

export default HomeScreen; 