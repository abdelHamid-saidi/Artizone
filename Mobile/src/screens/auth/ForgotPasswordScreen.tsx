import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import sharedStyles from '../../styles/shared';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (email.trim()) {
      Alert.alert(
        'Email envoyé !',
        `Un lien de récupération a été envoyé à ${email}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
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
      <TouchableOpacity style={sharedStyles.backButton} onPress={() => navigation.navigate('Login')}>
        <View style={sharedStyles.backCircle}>
          <AntDesign name="arrowleft" size={28} color="#444" />
        </View>
      </TouchableOpacity>
      <View style={sharedStyles.authContentContainer}>
        <Text style={sharedStyles.authTitle}>Mot de passe oublié</Text>
        <Text style={[sharedStyles.subtitle, { marginBottom: 32 }]}>
          Entrez votre adresse email pour recevoir un lien de récupération
        </Text>
        
        <TextInput
          style={sharedStyles.input}
          placeholder="Adresse email"
          placeholderTextColor="#B0B3C6"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={[
            sharedStyles.primaryButton, 
            { opacity: email.trim() ? 1 : 0.5 }
          ]}
          disabled={!email.trim()}
          onPress={handleResetPassword}
        >
          <Text style={sharedStyles.buttonText}>ENVOYER LE LIEN</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

export default ForgotPasswordScreen; 