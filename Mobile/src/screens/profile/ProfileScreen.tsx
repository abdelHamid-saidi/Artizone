import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  StyleSheet, 
  Animated, 
  ActivityIndicator
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import colors from '../../styles/colors';
import { storageService } from '../../services/storage';
import { profileService, handleApiError } from '../../services/api';
import CustomHeader from '../../components/CustomHeader';

// Composant Input personnalisé
const CustomInput = ({ 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  style,
  ...props 
}: any) => {
  return (
    <View style={[styles.customInputContainer, style]}>
      <TextInput
        style={styles.customInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
};

const ProfileScreen = ({ navigation }: any) => {
  const [userInfo, setUserInfo] = useState({
    nom: '',
    email: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  const loadUserInfo = async () => {
    try {
      console.log('🔄 Chargement des informations du profil...');
      
      // Vérifier si l'utilisateur est connecté
      const isAuth = await storageService.isAuthenticated();
      if (!isAuth) {
        console.log('❌ Utilisateur non connecté');
        Alert.alert('Erreur', 'Vous devez être connecté pour accéder au profil');
        return;
      }
      
      const token = await storageService.getAuthToken();
      console.log('🔑 Token trouvé:', token ? 'Oui' : 'Non');
      
      const response = await profileService.getProfile();
      
      if (response.user) {
        setUserInfo({
          nom: response.user.nom || '',
          email: response.user.email || '',
          telephone: response.user.telephone || '',
        });
        console.log('✅ Profil chargé avec succès:', response.user);
      }
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      const errorMessage = handleApiError(error);
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveField = async (field: string) => {
    if (!tempValue.trim()) {
      Alert.alert('Erreur', 'Le champ ne peut pas être vide');
      return;
    }

    try {
      setSaving(true);
      console.log('🔄 Mise à jour du champ:', field, 'avec la valeur:', tempValue.trim());
      
      // Préparer les données à mettre à jour
      const updateData: any = {};
      updateData[field] = tempValue.trim();
      
      const response = await profileService.updateProfile(updateData);
      
      if (response.user) {
        setUserInfo(prev => ({
          ...prev,
          [field]: tempValue.trim()
        }));
        
        console.log('✅ Champ mis à jour avec succès:', field);
        Alert.alert('✅ Succès', `${getFieldLabel(field)} mis à jour avec succès`);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour champ:', field, error);
      const errorMessage = handleApiError(error);
      Alert.alert('❌ Erreur', errorMessage);
    } finally {
      setSaving(false);
      setEditingField(null);
      setTempValue('');
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue('');
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'nom': return 'Le nom';
      case 'email': return 'L\'email';
      case 'telephone': return 'Le téléphone';
      default: return 'Le champ';
    }
  };

  const handleChangePassword = () => {
    Alert.alert('Changer le mot de passe', 'Fonctionnalité à implémenter');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => Alert.alert('Compte supprimé', 'Votre compte a été supprimé')
        }
      ]
    );
  };

  const renderField = (field: string, label: string, placeholder: string, keyboardType: any = 'default') => {
    const isEditing = editingField === field;
    const value = userInfo[field as keyof typeof userInfo];

    return (
      <View style={styles.fieldContainer}>
        <View style={styles.fieldHeader}>
          <Text style={styles.label}>{label}</Text>
          {!isEditing && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => startEditing(field, value)}
            >
              <Feather name="edit-3" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        {isEditing ? (
          <View style={styles.editMode}>
            <CustomInput
              value={tempValue}
              onChangeText={setTempValue}
              placeholder={placeholder}
              keyboardType={keyboardType}
              autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
              autoFocus
              multiline={field === 'nom'}
            />
            <View style={styles.editButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={cancelEditing}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={() => saveField(field)}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.textInverse} />
                ) : (
                  <Text style={styles.saveText}>Sauvegarder</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.displayMode}>
            <Text style={styles.fieldValue}>{value}</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Profil"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informations personnelles */}
        <Animated.View style={[
          styles.section,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          {renderField('nom', 'Nom complet', 'Votre nom complet')}
          {renderField('email', 'Email', 'votre.email@exemple.com', 'email-address')}
          {renderField('telephone', 'Téléphone', '+33 6 12 34 56 78', 'phone-pad')}
        </Animated.View>

        {/* Sécurité et compte */}
        <Animated.View style={[
          styles.section,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <View style={[styles.menuIcon, { backgroundColor: colors.warning }]}>
              <Feather name="lock" size={20} color={colors.textInverse} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Changer le mot de passe</Text>
              <Text style={styles.menuSubtitle}>Mettre à jour votre mot de passe</Text>
            </View>
            <AntDesign name="right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.dangerItem]} 
            onPress={handleDeleteAccount}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.error }]}>
              <Feather name="trash-2" size={20} color={colors.textInverse} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuTitle, styles.dangerText]}>Supprimer le compte</Text>
              <Text style={[styles.menuSubtitle, styles.dangerText]}>Action irréversible</Text>
            </View>
            <AntDesign name="right" size={16} color={colors.error} />
          </TouchableOpacity>
        </Animated.View>

        {/* Version de l'app */}
        <Animated.View style={[
          styles.versionSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Text style={styles.versionText}>Artizone v1.0.0</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  editButton: {
    padding: 4,
    borderRadius: 4,
  },
  displayMode: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text,
  },
  editMode: {
    gap: 12,
  },
  customInputContainer: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  customInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    backgroundColor: 'transparent',
    minHeight: 48,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: colors.error,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: colors.textTertiary,
  },
});

export default ProfileScreen; 