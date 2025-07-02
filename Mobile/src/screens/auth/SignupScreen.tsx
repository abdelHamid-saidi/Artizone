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
        email: response.user?.email
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