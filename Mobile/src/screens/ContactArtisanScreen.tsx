import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  Linking,
} from 'react-native';
import { AntDesign, Feather, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';
import { Artisan, handleApiError } from '../services/api';

const { width, height } = Dimensions.get('window');

const ContactArtisanScreen = ({ navigation, route }: any) => {
  const { artisan } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');

  // Services statiques pour la démonstration
  const defaultServices = [
    {
      id: 'service-1',
      nom: 'Rénovation Salle de Bain',
      description: 'Rénovation complète de salle de bain avec pose de carrelage, plomberie et électricité',
      prix: 85,
      duree: 120,
      categorieId: 'cat-1'
    },
    {
      id: 'service-2',
      nom: 'Installation Cuisine',
      description: 'Installation et pose de meubles de cuisine, plan de travail et électroménager',
      prix: 120,
      duree: 180,
      categorieId: 'cat-2'
    },
    {
      id: 'service-3',
      nom: 'Peinture Intérieure',
      description: 'Peinture des murs et plafonds, préparation des surfaces et finitions',
      prix: 45,
      duree: 90,
      categorieId: 'cat-3'
    }
  ];

  // Utiliser les services de l'artisan ou les services par défaut
  const availableServices = artisan.services && artisan.services.length > 0 
    ? artisan.services 
    : defaultServices;

  // Données statiques pour l'artisan si les données sont incomplètes
  const artisanData = {
    nom: artisan.nom || 'Jean Dupont',
    note: artisan.note || 4.8,
    nombreAvis: artisan.nombreAvis || 127,
    ville: artisan.ville || 'Paris',
    codePostal: artisan.codePostal || '75001',
    description: artisan.description || 'Artisan expérimenté spécialisé dans la rénovation et l\'aménagement intérieur. Plus de 15 ans d\'expérience dans le domaine.',
    telephone: artisan.telephone || '+33 6 12 34 56 78',
    email: artisan.email || 'jean.dupont@artizone.fr'
  };
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSendReservation = async () => {
    if (!subject.trim() || !message.trim() || !selectedDate || !selectedTime || !selectedService) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      // Simulation d'envoi de réservation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Demande envoyée',
        'Votre demande de réservation a été envoyée avec succès. L\'artisan vous contactera pour confirmer le créneau.',
        [
          {
            text: 'OK',
            onPress: () => {
              setSubject('');
              setMessage('');
              setSelectedDate('');
              setSelectedTime('');
              setSelectedService('');
              setUrgency('normal');
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer la demande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const renderTimeSlot = (time: string) => (
    <TouchableOpacity
      key={time}
      style={[
        styles.timeSlotButton,
        selectedTime === time && styles.timeSlotButtonActive,
      ]}
      onPress={() => setSelectedTime(time)}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.timeSlotText,
        selectedTime === time && styles.timeSlotTextActive,
      ]}>
        {time}
      </Text>
    </TouchableOpacity>
  );

  const renderServiceOption = (service: any) => (
    <TouchableOpacity
      key={service.id}
      style={[
        styles.serviceOptionButton,
        selectedService === service.id && styles.serviceOptionButtonActive,
      ]}
      onPress={() => setSelectedService(service.id)}
      activeOpacity={0.8}
    >
      <View style={styles.serviceOptionInfo}>
        <Text style={[
          styles.serviceOptionName,
          selectedService === service.id && styles.serviceOptionNameActive,
        ]}>
          {service.nom}
        </Text>
        <Text style={styles.serviceOptionPrice}>{service.prix}€</Text>
      </View>
      {selectedService === service.id && (
        <AntDesign name="checkcircle" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <CustomHeader
        title="Réserver l'artisan"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* En-tête de l'artisan */}
        <Animated.View
          style={[
            styles.artisanHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.artisanAvatar}>
            <FontAwesome5 name="user-tie" size={32} color={colors.primary} />
          </View>
          <View style={styles.artisanInfo}>
            <Text style={styles.artisanName}>{artisanData.nom}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <AntDesign
                    key={star}
                    name={star <= artisanData.note ? "star" : "staro"}
                    size={16}
                    color={star <= artisanData.note ? colors.warning : colors.borderLight}
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>
                {artisanData.note.toFixed(1)}
              </Text>
              <Text style={styles.reviewCount}>({artisanData.nombreAvis} avis)</Text>
            </View>
            <Text style={styles.artisanLocation}>
              <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
              {artisanData.ville}, {artisanData.codePostal}
            </Text>
          </View>
        </Animated.View>

        {/* Informations supplémentaires sur l'artisan */}
        <Animated.View
          style={[
            styles.artisanDetailsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>À propos de l'artisan</Text>
          
          <View style={styles.artisanDetailsCard}>
            <View style={styles.detailRow}>
              <MaterialIcons name="person" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>{artisanData.description}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialIcons name="phone" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>{artisanData.telephone}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialIcons name="email" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>{artisanData.email}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={16} color={colors.textSecondary} />
              <Text style={styles.detailText}>Disponible du lundi au vendredi, 8h-18h</Text>
            </View>
          </View>
        </Animated.View>

        {/* Sélection du service */}
        <Animated.View
          style={[
            styles.serviceSelectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Choisissez le service *</Text>
          
          {availableServices && availableServices.length > 0 ? (
            availableServices.map(renderServiceOption)
          ) : (
            <View style={styles.noServicesCard}>
              <MaterialIcons name="info-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.noServicesText}>Aucun service disponible</Text>
            </View>
          )}
        </Animated.View>

        {/* Sélection de la date */}
        <Animated.View
          style={[
            styles.dateSelectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Choisissez la date *</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Date souhaitée (ex: 15/12/2024)"
              placeholderTextColor={colors.textSecondary}
              value={selectedDate}
              onChangeText={setSelectedDate}
            />
          </View>
        </Animated.View>

        {/* Sélection de l'heure */}
        <Animated.View
          style={[
            styles.timeSelectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Choisissez l'heure *</Text>
          
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map(renderTimeSlot)}
          </View>
        </Animated.View>

        {/* Niveau d'urgence */}
        <Animated.View
          style={[
            styles.urgencyContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Niveau d'urgence</Text>
          
          <View style={styles.urgencyButtons}>
            <TouchableOpacity
              style={[
                styles.urgencyButton,
                urgency === 'normal' && styles.urgencyButtonActive,
              ]}
              onPress={() => setUrgency('normal')}
              activeOpacity={0.8}
            >
              <MaterialIcons 
                name="schedule" 
                size={20} 
                color={urgency === 'normal' ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.urgencyButtonText,
                urgency === 'normal' && styles.urgencyButtonTextActive,
              ]}>
                Normal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.urgencyButton,
                urgency === 'urgent' && styles.urgencyButtonActive,
              ]}
              onPress={() => setUrgency('urgent')}
              activeOpacity={0.8}
            >
              <MaterialIcons 
                name="priority-high" 
                size={20} 
                color={urgency === 'urgent' ? colors.error : colors.textSecondary} 
              />
              <Text style={[
                styles.urgencyButtonText,
                urgency === 'urgent' && styles.urgencyButtonTextActive,
              ]}>
                Urgent
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Formulaire de demande */}
        <Animated.View
          style={[
            styles.messageFormContainer,
            {
              opacity: formAnim,
              transform: [
                {
                  translateY: formAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Détails de votre demande</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Sujet *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Sujet de votre réservation..."
              placeholderTextColor={colors.textSecondary}
              value={subject}
              onChangeText={setSubject}
              maxLength={100}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.messageInput]}
              placeholder="Décrivez votre projet et vos besoins spécifiques..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text style={styles.charCount}>{message.length}/1000</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendReservation}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.textInverse} />
            ) : (
              <>
                <Text style={styles.sendButtonText}>Envoyer la demande</Text>
                <Feather name="calendar" size={16} color={colors.textInverse} />
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        
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
  scrollContent: {
    paddingBottom: 40,
  },
  artisanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
    marginBottom: 16,
  },
  artisanAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  artisanInfo: {
    flex: 1,
  },
  artisanName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  artisanLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactMethodsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  contactMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  contactMethodCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  contactMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactMethodInfo: {
    flex: 1,
  },
  contactMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  contactMethodTitleActive: {
    color: colors.primary,
  },
  contactMethodSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  messageFormContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  additionalInfoContainer: {
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  serviceName: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  serviceSelectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  serviceOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  serviceOptionButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  serviceOptionInfo: {
    flex: 1,
  },
  serviceOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  serviceOptionNameActive: {
    color: colors.primary,
  },
  serviceOptionPrice: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noServicesCard: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  noServicesText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  dateSelectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeSelectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlotButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  timeSlotTextActive: {
    color: colors.textInverse,
  },
  urgencyContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  urgencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  urgencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  urgencyButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  urgencyButtonTextActive: {
    color: colors.primary,
  },
  artisanDetailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  artisanDetailsCard: {
    backgroundColor: colors.background,
    padding: 16,
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default ContactArtisanScreen; 