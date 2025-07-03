import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { AntDesign, Feather, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';
import {
  artisanService,
  categorieService,
  Artisan,
  Categorie,
  handleApiError,
} from '../services/api';
import { storageService } from '../services/storage';

const { width } = Dimensions.get('window');

const ArtisanScreen = ({ navigation }: any) => {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArtisans, setTotalArtisans] = useState(0);
  const [userInfo, setUserInfo] = useState({
    id: '',
    nom: '',
    email: '',
    telephone: '',
  });

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    loadUserInfo();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateSearch = () => {
    Animated.spring(searchAnim, {
      toValue: searchText.length > 0 ? 1 : 0,
      useNativeDriver: true,
    }).start();
  };

  const animateCard = (artisanId: string, delay: number = 0) => {
    if (!cardAnimations[artisanId]) {
      cardAnimations[artisanId] = new Animated.Value(0);
    }

    Animated.timing(cardAnimations[artisanId], {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  };

  const loadUserInfo = async () => {
    try {
      console.log('🔍 Récupération des informations utilisateur...');
      const token = await storageService.getAuthToken();
      const role = await storageService.getUserRole();
      const userId = await storageService.getUserId();
      
      if (token && role && userId) {
        console.log('✅ Utilisateur connecté trouvé:', { userId, role });
        setUserInfo({
          id: userId,
          nom: 'Utilisateur',
          email: 'user@example.com',
          telephone: '+33 6 12 34 56 78',
        });
        
        // Charger les catégories et les artisans une fois l'utilisateur identifié
        await Promise.all([loadCategories(), loadArtisans()]);
      } else {
        console.warn('⚠️ Aucun utilisateur connecté trouvé');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des informations utilisateur:', error);
      setLoading(false);
    }
  };

  // Charger les catégories
  const loadCategories = async () => {
    try {
      console.log('🏷️ Chargement des catégories...');
      const response = await categorieService.getCategories();
      setCategories(response.data || []);
      console.log('✅ Catégories chargées:', response.data?.length || 0);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des catégories:', error);
      Alert.alert('Erreur', handleApiError(error), [{ text: 'OK' }]);
    }
  };

  // Charger les artisans
  const loadArtisans = async (page: number = 1, append: boolean = false) => {
    try {
      console.log('👨‍🔧 Chargement des artisans...', {
        page,
        searchText,
        selectedCategory
      });
      
      if (!append) {
        setLoading(true);
      }
      
      const response = await artisanService.getArtisans(
        page,
        10, // 10 par page
        searchText || undefined,
        selectedCategory || undefined
      );
      
      const newArtisans = response.data || [];
      
      if (append) {
        setArtisans(prev => [...prev, ...newArtisans]);
      } else {
        setArtisans(newArtisans);
        // Animer les nouvelles cartes
        newArtisans.forEach((artisan, index) => {
          animateCard(artisan.id, index * 100);
        });
      }
      
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setTotalArtisans(response.pagination.total);
      
      console.log('✅ Artisans chargés:', {
        count: newArtisans.length,
        total: response.pagination.total,
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        category: selectedCategory
      });
      
      return response;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des artisans:', error);
      Alert.alert('Erreur', handleApiError(error), [{ text: 'OK' }]);
      throw error;
    } finally {
      if (!append) {
        setLoading(false);
      }
    }
  };

  // Recherche d'artisans
  const handleSearch = () => {
    setCurrentPage(1);
    loadArtisans(1, false);
  };

  // Filtrer par catégorie
  const handleCategoryFilter = async (categoryId: string | null) => {
    console.log('🎯 Filtre catégorie:', {
      categoryId,
      selectedCategory,
      isSame: selectedCategory === categoryId
    });
    
    // Si on clique sur la même catégorie déjà sélectionnée, on la désélectionne
    // Sinon on sélectionne la nouvelle catégorie
    const newCategoryId = selectedCategory === categoryId ? null : categoryId;
    
    console.log('✅ Nouvelle catégorie sélectionnée:', newCategoryId);
    
    setSelectedCategory(newCategoryId);
    setCurrentPage(1);
    setRefreshing(true);
    
    try {
      // Appeler directement l'API avec la nouvelle catégorie
      const response = await artisanService.getArtisans(
        1,
        10,
        searchText || undefined,
        newCategoryId || undefined
      );
      
      const newArtisans = response.data || [];
      setArtisans(newArtisans);
      
      // Animer les nouvelles cartes
      newArtisans.forEach((artisan, index) => {
        animateCard(artisan.id, index * 100);
      });
      
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setTotalArtisans(response.pagination.total);
      
      console.log('✅ Liste rafraîchie après filtrage avec catégorie:', newCategoryId);
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
      Alert.alert('Erreur', handleApiError(error), [{ text: 'OK' }]);
    } finally {
      setRefreshing(false);
    }
  };

  // Charger plus d'artisans (pagination)
  const loadMoreArtisans = () => {
    if (currentPage < totalPages && !loading) {
      loadArtisans(currentPage + 1, true);
    }
  };

  // Rafraîchir les données
  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await Promise.all([loadCategories(), loadArtisans(1, false)]);
    setRefreshing(false);
  };

  // Rendu d'un artisan
  const renderArtisan = ({ item, index }: { item: Artisan; index: number }) => {
    const cardAnimation = cardAnimations[item.id] || new Animated.Value(0);
    
    return (
      <Animated.View
        style={[
          styles.artisanCard,
          {
            opacity: cardAnimation,
            transform: [
              {
                translateY: cardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            console.log('👨‍🔧 Navigation vers artisan:', item.id);
            // navigation.navigate('ArtisanDetail', { artisanId: item.id });
          }}
          activeOpacity={0.8}
          style={styles.artisanTouchable}
        >
          {/* En-tête avec photo de profil et informations principales */}
          <View style={styles.artisanHeader}>
            <View style={styles.artisanAvatar}>
              <FontAwesome5 name="user-tie" size={24} color={colors.primary} />
            </View>
            
            <View style={styles.artisanInfo}>
              <Text style={styles.artisanName}>{item.nom}</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <AntDesign
                      key={star}
                      name={item.note && star <= item.note ? "star" : "staro"}
                      size={14}
                      color={item.note && star <= item.note ? colors.warning : colors.borderLight}
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {item.note ? item.note.toFixed(1) : 'N/A'}
                </Text>
                {item.nombreAvis && (
                  <Text style={styles.reviewCount}>({item.nombreAvis})</Text>
                )}
              </View>
            </View>
            
            <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.7}>
              <AntDesign name="hearto" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          {item.description && (
            <Text style={styles.artisanDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {/* Informations de contact */}
          <View style={styles.artisanDetails}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="location-on" size={16} color={colors.primary} />
              </View>
              <Text style={styles.detailText}>
                {item.ville ? `${item.ville}${item.codePostal ? `, ${item.codePostal}` : ''}` : 'Adresse non disponible'}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="phone" size={16} color={colors.primary} />
              </View>
              <Text style={styles.detailText}>{item.telephone}</Text>
            </View>
          </View>

          {/* Catégories */}
          {item.categories && item.categories.length > 0 && (
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Spécialités</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.categories.map((category) => (
                  <View key={category.id} style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{category.nom}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Services */}
          {item.services && item.services.length > 0 && (
            <View style={styles.servicesContainer}>
              <Text style={styles.sectionTitle}>Services disponibles</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.services.slice(0, 3).map((service) => (
                  <View key={service.id} style={styles.serviceBadge}>
                    <Text style={styles.serviceName}>{service.nom}</Text>
                    <Text style={styles.servicePrice}>{service.prix}€</Text>
                  </View>
                ))}
                {item.services.length > 3 && (
                  <View style={styles.moreServicesBadge}>
                    <Text style={styles.moreServicesText}>+{item.services.length - 3}</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {/* Bouton d'action */}
          <TouchableOpacity 
            style={styles.contactButton} 
            activeOpacity={0.8}
            onPress={() => {
              console.log('📅 Navigation vers réservation artisan:', item.id);
              navigation.navigate('ContactArtisan', { artisan: item });
            }}
          >
            <Text style={styles.contactButtonText}>Réserver</Text>
            <Feather name="calendar" size={16} color={colors.textInverse} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Rendu d'une catégorie
  const renderCategory = ({ item }: { item: Categorie }) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryFilter,
          isSelected && styles.categoryFilterActive,
        ]}
        onPress={async () => {
          console.log('🖱️ Clic sur catégorie:', item.nom, 'ID:', item.id);
          await handleCategoryFilter(item.id);
        }}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.categoryFilterText,
            isSelected && styles.categoryFilterTextActive,
          ]}
        >
          {item.nom} {isSelected ? '✓' : ''}
        </Text>
      </TouchableOpacity>
    );
  };

  // Rendu du footer de pagination
  const renderFooter = () => {
    if (currentPage >= totalPages) return null;
    
    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={loadMoreArtisans}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Text style={styles.loadMoreText}>Charger plus d'artisans</Text>
              <Feather name="chevron-down" size={16} color={colors.primary} />
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <CustomHeader
        title="Artisans"
        showBack={false}
        showNotification={true}
        notificationCount={0}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* Barre de recherche améliorée */}
      <Animated.View 
        style={[
          styles.searchContainer,
          {
            transform: [
              {
                scale: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.searchInputContainer}>
          <AntDesign name="search1" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un artisan..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              animateSearch();
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                animateSearch();
                handleSearch();
              }}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Filtres par catégorie */}
      {categories.length > 0 && (
        <Animated.View 
          style={[
            styles.filtersContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.filtersTitle}>Filtrer par spécialité</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </Animated.View>
      )}

      {/* Statistiques */}
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.statsContent}>
          <MaterialIcons name="people" size={20} color={colors.primary} />
          <Text style={styles.statsText}>
            {totalArtisans} artisan{totalArtisans > 1 ? 's' : ''} trouvé{totalArtisans > 1 ? 's' : ''}
            {selectedCategory && ` dans ${categories.find(c => c.id === selectedCategory)?.nom}`}
          </Text>
        </View>
      </Animated.View>

      {/* Liste des artisans */}
      {loading && artisans.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement des artisans...</Text>
        </View>
      ) : artisans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="people-outline" size={80} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Aucun artisan trouvé</Text>
          <Text style={styles.emptyText}>
            {searchText || selectedCategory
              ? 'Essayez de modifier vos critères de recherche'
              : 'Aucun artisan disponible pour le moment'}
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => {
              setSearchText('');
              setSelectedCategory(null);
              loadArtisans(1, false);
            }}
          >
            <Text style={styles.emptyButtonText}>Réinitialiser les filtres</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={artisans}
          renderItem={renderArtisan}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.artisansList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          onEndReached={loadMoreArtisans}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  filtersList: {
    paddingRight: 20,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryFilterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryFilterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: colors.textInverse,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
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
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  emptyButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  artisansList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  artisanCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  artisanTouchable: {
    padding: 16,
  },
  artisanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  artisanAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
  },
  artisanDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  artisanDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  servicesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  serviceBadge: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  servicePrice: {
    fontSize: 12,
    color: colors.success,
    fontWeight: 'bold',
    marginTop: 2,
  },
  moreServicesBadge: {
    backgroundColor: colors.textSecondary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  moreServicesText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  loadMoreContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadMoreButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  loadMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  contactButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  contactButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ArtisanScreen; 