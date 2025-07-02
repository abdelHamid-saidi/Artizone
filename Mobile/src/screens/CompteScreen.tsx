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
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔄 Déconnexion en cours...');
              
              // Utiliser la nouvelle fonction de déconnexion
              const success = await storageService.logout();
              
              if (success) {
                console.log('✅ Déconnexion réussie, navigation vers Login');
                
                // Naviguer vers l'écran de connexion
                // Utiliser reset pour éviter les problèmes de navigation
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } else {
                console.log('❌ Échec de la déconnexion');
                Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
              }
            } catch (error) {
              console.error('❌ Erreur lors de la déconnexion:', error);
              Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
            }
          },
        },
      ]
    );
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

      {/* Profil utilisateur */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(userInfo.nom) }]}>
            <Text style={styles.avatarText}>{getInitials(userInfo.nom)}</Text>
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{userInfo.nom}</Text>
          <Text style={styles.userEmail}>{userInfo.email}</Text>
          <Text style={styles.userPhone}>{userInfo.telephone}</Text>
        </View>
      </View>

      {/* Menu */}
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
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color={colors.textInverse} />
            <Text style={styles.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
          
          {/* Bouton de test temporaire */}
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.warning, marginTop: 10 }]} 
            onPress={async () => {
              const token = await storageService.getAuthToken();
              const isAuth = await storageService.isAuthenticated();
              Alert.alert('Debug', `Token: ${token ? 'Présent' : 'Absent'}\nAuthentifié: ${isAuth ? 'Oui' : 'Non'}`);
            }}
          >
            <MaterialIcons name="bug-report" size={20} color={colors.textInverse} />
            <Text style={styles.logoutText}>Debug Auth</Text>
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