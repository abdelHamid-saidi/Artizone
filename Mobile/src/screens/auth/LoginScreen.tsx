import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import sharedStyles from '../../styles/shared';
import { authService, handleApiError } from '../../services/api';
import { storageService } from '../../services/storage';
import { API_CONFIG } from '../../config/api';

const LoginScreen = ({ navigation }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation des champs
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse email valide');
      return;
    }

    setLoading(true);

    // Logs de débogage
    console.log('🔐 === DÉBUT TENTATIVE DE CONNEXION ===');

    try {
      // Utilisation de l'endpoint particulier séparé
      const response = await authService.loginParticulier({
        email: email.trim(),
        motDePasse: password,
      });

      // Sauvegarder le token et les informations utilisateur
      await storageService.saveAuthToken(
        response.token, 
        response.role, 
        response.user?.id?.toString()
      );

      console.log('✅ Connexion réussie:', {
        role: response.role,
        userId: response.user?.id,
        email: response.user?.email
      });

      // Redirection vers Home
      navigation.navigate('Home');
      
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });

      const errorMessage = handleApiError(error);
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setLoading(false);
      console.log('🔐 === FIN TENTATIVE DE CONNEXION ===\n');
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
        <Text style={sharedStyles.authTitle}>Bon retour !</Text>
        
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
            style={[sharedStyles.input, { marginBottom: 0, flex: 1, borderWidth: 0}]}
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
        <TouchableOpacity 
          style={[
            sharedStyles.primaryButton,
            { opacity: loading ? 0.7 : 1 }
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={sharedStyles.buttonText}>SE CONNECTER</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} disabled={loading}>
          <Text style={sharedStyles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
        <View style={sharedStyles.bottomContainer}>
          <Text style={sharedStyles.loginText}>
            Pas de compte ?{' '}
            <Text style={sharedStyles.linkText} onPress={() => navigation.navigate('Signup')}>
              S'inscrire
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen; 