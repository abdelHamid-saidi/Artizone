import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import sharedStyles from '../styles/shared';

const { width } = Dimensions.get('window');

const LandingPage = () => {
  const navigation = useNavigation<any>();
  
  return (
    <View style={sharedStyles.container}>
      <Image
        source={require('../../assets/landing/frame.png')}
        style={sharedStyles.waveImage}
        resizeMode="cover"
      />
      <Image
        source={require('../../assets/landing/landing.png')}
        style={sharedStyles.illustrationImage}
        resizeMode="contain"
      />
      <View style={sharedStyles.contentContainer}>
        <View style={sharedStyles.textContainer}>
          <Text style={sharedStyles.title}>Des artisans dans votre zone</Text>
          <Text style={sharedStyles.subtitle}>
            Trouvez un artisan de confiance près de chez vous, en quelques clics.
          </Text>
        </View>
        <TouchableOpacity style={sharedStyles.primaryButton} onPress={() => navigation.navigate('Signup')} activeOpacity={0.8}>
          <Text style={sharedStyles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
        <View style={sharedStyles.loginContainer}>
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

export default LandingPage; 