import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
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
      console.log('👨‍🔧 Chargement des artisans...');
      setLoading(true);
      
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
      }
      
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setTotalArtisans(response.pagination.total);
      
      console.log('✅ Artisans chargés:', {
        count: newArtisans.length,
        total: response.pagination.total,
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
      });
    } catch (error) {
      console.error('❌ Erreur lors du chargement des artisans:', error);
      Alert.alert('Erreur', handleApiError(error), [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  // Recherche d'artisans
  const handleSearch = () => {
    setCurrentPage(1);
    loadArtisans(1, false);
  };

  // Filtrer par catégorie
  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    loadArtisans(1, false);
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
  const renderArtisan = ({ item }: { item: Artisan }) => (
    <TouchableOpacity
      style={styles.artisanCard}
      onPress={() => {
        // Navigation vers le détail de l'artisan
        console.log('👨‍🔧 Navigation vers artisan:', item.id);
        // navigation.navigate('ArtisanDetail', { artisanId: item.id });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.artisanHeader}>
        <View style={styles.artisanInfo}>
          <Text style={styles.artisanName}>{item.nom}</Text>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>
              {item.note ? item.note.toFixed(1) : 'N/A'}
            </Text>
            {item.nombreAvis && (
              <Text style={styles.reviewCount}>({item.nombreAvis} avis)</Text>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <AntDesign name="hearto" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {item.description && (
        <Text style={styles.artisanDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.artisanDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {item.ville ? `${item.ville}${item.codePostal ? `, ${item.codePostal}` : ''}` : 'Adresse non disponible'}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <MaterialIcons name="phone" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{item.telephone}</Text>
        </View>
      </View>

      {item.categories && item.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.categories.map((category) => (
              <View key={category.id} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{category.nom}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {item.services && item.services.length > 0 && (
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>Services disponibles:</Text>
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
    </TouchableOpacity>
  );

  // Rendu d'une catégorie
  const renderCategory = ({ item }: { item: Categorie }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        selectedCategory === item.id && styles.categoryFilterActive,
      ]}
      onPress={() => handleCategoryFilter(selectedCategory === item.id ? null : item.id)}
    >
      <Text
        style={[
          styles.categoryFilterText,
          selectedCategory === item.id && styles.categoryFilterTextActive,
        ]}
      >
        {item.nom}
      </Text>
    </TouchableOpacity>
  );

  // Rendu du footer de pagination
  const renderFooter = () => {
    if (currentPage >= totalPages) return null;
    
    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={loadMoreArtisans}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.loadMoreText}>Charger plus d'artisans</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Artisans"
        showBack={false}
        showNotification={true}
        notificationCount={0}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <AntDesign name="search1" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un artisan..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
                handleSearch();
              }}
            >
              <AntDesign name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtres par catégorie */}
      {categories.length > 0 && (
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersTitle}>Filtrer par catégorie:</Text>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        </View>
      )}

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {totalArtisans} artisan{totalArtisans > 1 ? 's' : ''} trouvé{totalArtisans > 1 ? 's' : ''}
          {selectedCategory && ` dans ${categories.find(c => c.id === selectedCategory)?.nom}`}
        </Text>
      </View>

      {/* Liste des artisans */}
      {loading && artisans.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement des artisans...</Text>
        </View>
      ) : artisans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="people-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Aucun artisan trouvé</Text>
          <Text style={styles.emptyText}>
            {searchText || selectedCategory
              ? 'Essayez de modifier vos critères de recherche'
              : 'Aucun artisan disponible pour le moment'}
          </Text>
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
  statsText: {
    fontSize: 14,
    color: colors.textSecondary,
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
  artisansList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  artisanCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 4,
  },
  artisanDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  artisanDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  categoriesContainer: {
    marginBottom: 12,
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
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
});

export default ArtisanScreen; 