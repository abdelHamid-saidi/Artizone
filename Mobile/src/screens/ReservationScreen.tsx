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
  Animated,
  Dimensions,
  StatusBar 
} from 'react-native';
import { AntDesign, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';

const { width, height } = Dimensions.get('window');

// Interface pour les réservations
interface Reservation {
  id: string;
  artisanId: string;
  artisanName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'en_attente' | 'confirmée' | 'annulée' | 'terminée';
  price: number;
  description: string;
  address: string;
  urgency: 'normal' | 'urgent';
  createdAt: string;
}

const ReservationScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'en_attente' | 'confirmée' | 'terminée'>('all');
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // 3 fausses réservations statiques
  const staticReservations: Reservation[] = [
    {
      id: 'res-1',
      artisanId: 'art-1',
      artisanName: 'Jean Dupont',
      serviceName: 'Rénovation Salle de Bain',
      date: '2024-12-15',
      time: '14:00',
      status: 'confirmée',
      price: 85,
      description: 'Rénovation complète de la salle de bain avec pose de carrelage, plomberie et électricité. Remplacement de la baignoire par une douche à l\'italienne.',
      address: '123 Rue de la Paix, 75001 Paris',
      urgency: 'normal',
      createdAt: '2024-12-01T10:30:00Z'
    },
    {
      id: 'res-2',
      artisanId: 'art-2',
      artisanName: 'Marie Martin',
      serviceName: 'Installation Cuisine',
      date: '2024-12-20',
      time: '09:00',
      status: 'en_attente',
      price: 120,
      description: 'Installation et pose de meubles de cuisine, plan de travail en granit et électroménager. Cuisine moderne avec îlot central.',
      address: '456 Avenue des Champs, 75008 Paris',
      urgency: 'urgent',
      createdAt: '2024-12-02T14:15:00Z'
    },
    {
      id: 'res-3',
      artisanId: 'art-3',
      artisanName: 'Pierre Durand',
      serviceName: 'Peinture Intérieure',
      date: '2024-12-10',
      time: '10:30',
      status: 'terminée',
      price: 45,
      description: 'Peinture des murs et plafonds du salon et de la chambre principale. Couleurs : blanc cassé pour les murs, blanc pur pour les plafonds.',
      address: '789 Boulevard Saint-Germain, 75006 Paris',
      urgency: 'normal',
      createdAt: '2024-11-28T16:45:00Z'
    }
  ];

  const [reservations, setReservations] = useState<Reservation[]>(staticReservations);

  useEffect(() => {
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

  // Filtrer les réservations selon le statut sélectionné
  const filteredReservations = reservations.filter(reservation => {
    if (selectedFilter === 'all') return true;
    return reservation.status === selectedFilter;
  });

  // Fonction de rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulation d'un rafraîchissement
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('🔄 Réservations rafraîchies');
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Obtenir l'icône selon le statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'clock-circle';
      case 'confirmée':
        return 'check-circle';
      case 'annulée':
        return 'close-circle';
      case 'terminée':
        return 'check-circle';
      default:
        return 'question-circle';
    }
  };

  // Obtenir la couleur selon le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_attente':
        return colors.warning;
      case 'confirmée':
        return colors.success;
      case 'annulée':
        return colors.error;
      case 'terminée':
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  // Obtenir le texte du statut
  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'confirmée':
        return 'Confirmée';
      case 'annulée':
        return 'Annulée';
      case 'terminée':
        return 'Terminée';
      default:
        return 'Inconnu';
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Formater l'heure
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Gérer les actions sur une réservation
  const handleReservationAction = (reservation: Reservation, action: string) => {
    Alert.alert(
      'Action sur la réservation',
      `Que souhaitez-vous faire avec la réservation de ${reservation.serviceName} ?`,
      [
        {
          text: 'Voir les détails',
          onPress: () => {
            Alert.alert(
              'Détails de la réservation',
              `Artisan: ${reservation.artisanName}\nService: ${reservation.serviceName}\nDate: ${formatDate(reservation.date)}\nHeure: ${formatTime(reservation.time)}\nPrix: ${reservation.price}€\nStatut: ${getStatusText(reservation.status)}\nAdresse: ${reservation.address}\nDescription: ${reservation.description}`,
              [{ text: 'OK' }]
            );
          }
        },
        {
          text: 'Contacter l\'artisan',
          onPress: () => {
            Alert.alert('Contact', `Contacter ${reservation.artisanName} pour cette réservation.`);
          }
        },
        {
          text: 'Annuler',
          style: 'cancel'
        }
      ]
    );
  };

  // Rendu d'une réservation
  const renderReservation = (reservation: Reservation) => (
    <Animated.View
      key={reservation.id}
      style={[
        styles.reservationCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => handleReservationAction(reservation, 'details')}
        activeOpacity={0.8}
      >
        {/* En-tête de la réservation */}
        <View style={styles.reservationHeader}>
          <View style={styles.artisanInfo}>
            <View style={styles.artisanAvatar}>
              <FontAwesome5 name="user-tie" size={20} color={colors.primary} />
            </View>
            <View style={styles.artisanDetails}>
              <Text style={styles.artisanName}>{reservation.artisanName}</Text>
              <Text style={styles.serviceName}>{reservation.serviceName}</Text>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <AntDesign
              name={getStatusIcon(reservation.status) as any}
              size={16}
              color={getStatusColor(reservation.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(reservation.status) }]}>
              {getStatusText(reservation.status)}
            </Text>
          </View>
        </View>

        {/* Informations de la réservation */}
        <View style={styles.reservationInfo}>
          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {formatDate(reservation.date)} à {formatTime(reservation.time)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {reservation.address}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="euro" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {reservation.price}€
            </Text>
            {reservation.urgency === 'urgent' && (
              <View style={styles.urgencyBadge}>
                <MaterialIcons name="priority-high" size={12} color={colors.error} />
                <Text style={styles.urgencyText}>Urgent</Text>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.reservationActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReservationAction(reservation, 'contact')}
          >
            <MaterialIcons name="phone" size={16} color={colors.primary} />
            <Text style={styles.actionButtonText}>Contacter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReservationAction(reservation, 'details')}
          >
            <MaterialIcons name="info" size={16} color={colors.textSecondary} />
            <Text style={styles.actionButtonText}>Détails</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <CustomHeader
        title="Mes Réservations"
        showBack={true}
        onBack={() => navigation.goBack()}
        showNotification={true}
        notificationCount={3}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

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
        {/* Filtres */}
        <Animated.View
          style={[
            styles.filtersContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'en_attente', label: 'En attente' },
              { key: 'confirmée', label: 'Confirmées' },
              { key: 'terminée', label: 'Terminées' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(filter.key as any)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.filterButtonTextActive,
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Liste des réservations */}
        <View style={styles.reservationsContainer}>
          {filteredReservations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="event-busy" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyTitle}>Aucune réservation</Text>
              <Text style={styles.emptyText}>
                {selectedFilter === 'all' 
                  ? 'Vous n\'avez pas encore de réservations'
                  : `Aucune réservation ${selectedFilter === 'en_attente' ? 'en attente' : selectedFilter === 'confirmée' ? 'confirmée' : 'terminée'}`
                }
              </Text>
            </View>
          ) : (
            filteredReservations.map(renderReservation)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  filterButton: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: colors.textInverse,
  },
  reservationsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  reservationCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  artisanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  artisanAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  artisanDetails: {
    flex: 1,
  },
  artisanName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  reservationInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  urgencyText: {
    fontSize: 10,
    color: colors.error,
    fontWeight: '600',
    marginLeft: 4,
  },
  reservationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    paddingHorizontal: 32,
  },
});

export default ReservationScreen; 