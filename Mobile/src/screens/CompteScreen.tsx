import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import { storageService } from '../services/storage';
import CustomHeader from '../components/CustomHeader';

const CompteScreen = ({ navigation }: any) => {
  const [userInfo, setUserInfo] = React.useState({
    nom: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    telephone: '+33 6 12 34 56 78',
  });

  React.useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      // Ici vous pourriez charger les vraies données depuis l'API
      // Pour l'instant, on utilise des données de démonstration
      const token = await storageService.getAuthToken();
      const role = await storageService.getUserRole();
      
      if (token && role) {
        // Données de démonstration - à remplacer par un appel API
        setUserInfo({
          nom: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          telephone: '+33 6 12 34 56 78',
        });
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur:', error);
    }
  };

  // Fonction pour générer les initiales
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Fonction pour générer une couleur de fond basée sur le nom
  const getAvatarColor = (name: string) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
      '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const menuItems = [
    {
      id: 1,
      titre: 'Informations personnelles',
      icon: 'user',
      color: colors.primary,
      action: () => navigation.navigate('Profile'),
    },
    {
      id: 2,
      titre: 'Adresses enregistrées',
      icon: 'map-pin',
      color: colors.error,
      action: () => navigation.navigate('Addresses'),
    },
    {
      id: 3,
      titre: 'Méthodes de paiement',
      icon: 'credit-card',
      color: colors.info,
      action: () => navigation.navigate('PaymentMethods'),
    },
    {
      id: 4,
      titre: 'Préférences',
      icon: 'settings',
      color: colors.warning,
      action: () => navigation.navigate('Preferences'),
    },
    {
      id: 5,
      titre: 'Aide et support',
      icon: 'help-circle',
      color: colors.success,
      action: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 6,
      titre: 'À propos',
      icon: 'info',
      color: colors.primaryGradient,
      action: () => navigation.navigate('About'),
    },
  ];

   const handleLogout = async () => {
    console.log('🚪 === FONCTION HANDLELOGOUT APPELÉE ===');
    
    try {
      console.log('📱 Tentative d\'affichage de l\'alerte...');
      
      Alert.alert(
        'Déconnexion',
        'Êtes-vous sûr de vouloir vous déconnecter ?',
        [
          {
            text: 'Annuler',
            style: 'cancel',
            onPress: () => {
              console.log('❌ Déconnexion annulée par l\'utilisateur');
            },
          },
          {
            text: 'Se déconnecter',
            style: 'destructive',
            onPress: async () => {
              console.log('🔄 === DÉBUT DÉCONNEXION ===');
              
              try {
                // Utiliser la méthode logout du service de stockage
                console.log('🗑️ Appel de storageService.logout()...');
                const success = await storageService.logout();
                console.log('📊 Résultat logout:', success);
                
                if (success) {
                  console.log('✅ Déconnexion réussie !');
                  
                  // Petit délai pour s'assurer que la déconnexion est bien terminée
                  await new Promise(resolve => setTimeout(resolve, 100));
                  
                  // Utiliser la navigation parent pour sortir du TabNavigator
                  console.log('🧭 Tentative de navigation...');
                  const parentNavigation = navigation.getParent();
                  if (parentNavigation) {
                    parentNavigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                    console.log('✅ Navigation vers Login réussie');
                  } else {
                    // Fallback si pas de navigation parent
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    });
                    console.log('✅ Navigation fallback vers Login réussie');
                  }
                } else {
                  console.log('❌ Échec de la déconnexion');
                  Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
                }
                
                console.log('🔄 === FIN DÉCONNEXION ===');
              } catch (error) {
                console.error('❌ Erreur lors de la déconnexion:', error);
                Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
              }
            },
          },
        ]
      );
      
      console.log('✅ Alerte affichée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de l\'affichage de l\'alerte:', error);
      
      // Fallback : déconnexion directe sans confirmation
      console.log('🔄 Déconnexion directe sans confirmation...');
      try {
        const success = await storageService.logout();
        if (success) {
          const parentNavigation = navigation.getParent();
          if (parentNavigation) {
            parentNavigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      } catch (logoutError) {
        console.error('❌ Erreur déconnexion directe:', logoutError);
      }
    }
  };



  return (
    <View style={styles.container}>
      <CustomHeader
        title="Compte"
        showBack={false}
        showNotification={true}
        notificationCount={3}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuSection}> 
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
              <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
                <Feather name={item.icon as any} size={20} color={colors.textInverse} />
              </View>
              <Text style={styles.menuTitle}>{item.titre}</Text>
              <AntDesign name="right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton de déconnexion */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
              console.log('🔘 Bouton déconnexion cliqué !');
              handleLogout();
            }}
            activeOpacity={0.7}
            testID="logout-button"
          >
            <MaterialIcons name="logout" size={20} color={colors.textInverse} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: colors.background,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  profileSection: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    fontSize: 60,
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textInverse,
  }, 
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuSection: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  logoutSection: {
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CompteScreen; 