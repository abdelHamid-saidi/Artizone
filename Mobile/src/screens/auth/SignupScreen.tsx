import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import sharedStyles from '../../styles/shared';
import Checkbox from '../../components/Checkbox';
import { authService, handleApiError } from '../../services/api';
import { storageService } from '../../services/storage';

const SignupScreen = ({ navigation }: any) => {
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre nom');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir votre adresse email');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide');
      return false;
    }
    if (telephone.trim() && !isValidPhoneNumber(telephone.trim())) {
      Alert.alert('Erreur', 'Veuillez saisir un numéro de téléphone valide');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (!policyAccepted) {
      Alert.alert('Erreur', 'Veuillez accepter la politique de confidentialité');
      return false;
    }
    return true;
  };

  const isValidPhoneNumber = (phone: string) => {
    // Supprimer tous les espaces, tirets et points pour la validation
    const cleanedPhone = phone.replace(/[\s\-\.]/g, '');
    
    // Validation pour les numéros français
    // Formats acceptés :
    // - +33XXXXXXXXX (format international)
    // - 0033XXXXXXXXX (format international avec 00)
    // - 0XXXXXXXXX (format national)
    // - 33XXXXXXXXX (format international sans +)
    
    const phoneRegex = /^(?:(?:\+|00)33|0|33)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    
    // Vérification de base avec regex
    if (!phoneRegex.test(phone)) {
      return false;
    }
    
    // Vérification de la longueur après nettoyage
    const digitsOnly = cleanedPhone.replace(/\D/g, '');
    
    // Pour un numéro français :
    // - Avec indicatif pays (33) : 11 chiffres (33 + 9 chiffres)
    // - Sans indicatif pays : 10 chiffres (0 + 9 chiffres)
    if (digitsOnly.length === 10) {
      // Format 0XXXXXXXXX
      return digitsOnly.startsWith('0');
    } else if (digitsOnly.length === 11) {
      // Format 33XXXXXXXXX ou +33XXXXXXXXX
      return digitsOnly.startsWith('33');
    } else if (digitsOnly.length === 12) {
      // Format 0033XXXXXXXXX
      return digitsOnly.startsWith('0033');
    }
    
    return false;
  };

  const formatPhoneNumber = (text: string) => {
    // Supprimer tous les caractères non autorisés sauf +, espaces, tirets et points
    let cleaned = text.replace(/[^\d+\s\-\.]/g, '');
    
    // Limiter la longueur totale
    if (cleaned.length > 15) {
      cleaned = cleaned.substring(0, 15);
    }
    
    // Formatage automatique pour améliorer la lisibilité
    // Exemple : +33 6 12 34 56 78
    if (cleaned.startsWith('+33')) {
      // Garder le format +33 X XX XX XX XX
      return cleaned.replace(/(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    } else if (cleaned.startsWith('0033')) {
      // Convertir 0033 en +33
      cleaned = '+33' + cleaned.substring(4);
      return cleaned.replace(/(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    } else if (cleaned.startsWith('33')) {
      // Ajouter le + devant 33
      cleaned = '+' + cleaned;
      return cleaned.replace(/(\+33)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    } else if (cleaned.startsWith('0')) {
      // Format national français
      return cleaned.replace(/(0)(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
    }
    
    return cleaned;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Utilisation de l'endpoint particulier séparé
      const response = await authService.registerParticulier({
        nom: name.trim(),
        email: email.trim(),
        telephone: telephone.trim() || undefined, // Envoyer undefined si vide
        motDePasse: password,
      });

      // Sauvegarder le token et les informations utilisateur
      await storageService.saveAuthToken(
        response.token, 
        response.role, 
        response.user?.id?.toString()
      );

      console.log('Inscription réussie:', {
        role: response.role,
        userId: response.user?.id,
        email: response.user?.email,
        telephone: response.user?.telephone
      });

      // Redirection vers Home
      navigation.navigate('Home');
      
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert('Erreur d\'inscription', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={sharedStyles.authContainer}>
      {/* Vague décorative en fond */}
      <Image
        source={require('../../../assets/landing/frame.png')}
        style={sharedStyles.authWaveImage}
        resizeMode="cover"
      />
      <TouchableOpacity style={sharedStyles.backButton} onPress={() => navigation.navigate('Landing')}>
        <View style={sharedStyles.backCircle}>
          <AntDesign name="arrowleft" size={28} color="#444" />
        </View>
      </TouchableOpacity>
      <View style={sharedStyles.authContentContainer}>
        <Text style={sharedStyles.authTitle}>Créer votre compte</Text>
        <TextInput
          style={sharedStyles.input}
          placeholder="Nom"
          placeholderTextColor="#B0B3C6"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
        <TextInput
          style={sharedStyles.input}
          placeholder="Adresse email"
          placeholderTextColor="#B0B3C6"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <TextInput
          style={sharedStyles.input}
          placeholder="Téléphone (ex: +33 6 12 34 56 78 ou 06 12 34 56 78)"
          placeholderTextColor="#B0B3C6"
          value={telephone}
          onChangeText={(text) => setTelephone(formatPhoneNumber(text))}
          keyboardType="phone-pad"
          editable={!loading}
        />
        <View style={sharedStyles.passwordContainer}>
          <TextInput
            style={[sharedStyles.input, { marginBottom: 0, flex: 1, borderWidth: 0 }]}
            placeholder="Mot de passe"
            placeholderTextColor="#B0B3C6"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
          <TouchableOpacity 
            style={sharedStyles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <Feather 
              name={showPassword ? "eye-off" : "eye"} 
              size={22} 
              color="#444" 
            />
          </TouchableOpacity>
        </View>
        <View style={sharedStyles.policyContainer}>
          <Checkbox 
            checked={policyAccepted} 
            onToggle={() => setPolicyAccepted(!policyAccepted)}
            disabled={loading}
          />
          <Text style={sharedStyles.loginText}>J'ai lu la </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Policy')} disabled={loading}>
            <Text style={sharedStyles.linkText}>Politique de confidentialité</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[
            sharedStyles.primaryButton, 
            { 
              opacity: (policyAccepted && name.trim() && email.trim() && password.trim() && !loading) ? 1 : 0.5 
            }
          ]}
          disabled={!(policyAccepted && name.trim() && email.trim() && password.trim()) || loading}
          onPress={handleSignup}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={sharedStyles.buttonText}>COMMENCER</Text>
          )}
        </TouchableOpacity>
        <View style={sharedStyles.bottomContainer}>
          <Text style={sharedStyles.loginText}>
            Déjà un compte ?{' '}
            <Text style={sharedStyles.linkText} onPress={() => navigation.navigate('Login')}>
              Se connecter
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen; 