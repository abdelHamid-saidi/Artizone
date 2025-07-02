import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import sharedStyles from '../../styles/shared';
import colors from '../../styles/colors';

const EmailVerificationScreen = ({ navigation, route }: any) => {
  const [email] = useState(route.params?.email || 'votre email');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);

  const handleResendEmail = () => {
    if (!resendDisabled) {
      // Simuler l'envoi d'un nouvel email
      setResendDisabled(true);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      Alert.alert(
        'Code renvoyé !',
        'Un nouveau code de vérification a été envoyé.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = text;
    setVerificationCode(newCode);

    // Auto-focus sur le prochain champ
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Vérifier si le code est complet
    if (newCode.every(digit => digit !== '') && index === 5) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Retour en arrière
    if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = (code: string) => {
    // Ici vous pourrez ajouter la logique de vérification avec l'API
    console.log('Vérification du code:', code);
    
    // Simulation de vérification réussie
    Alert.alert(
      'Vérification réussie !',
      'Votre compte a été activé avec succès.',
      [
        {
          text: 'Continuer',
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  const handleContinue = () => {
    const code = verificationCode.join('');
    if (code.length === 6) {
      handleVerifyCode(code);
    } else {
      Alert.alert(
        'Code incomplet',
        'Veuillez saisir le code de vérification à 6 chiffres.',
        [{ text: 'OK' }]
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
      <TouchableOpacity style={sharedStyles.backButton} onPress={() => navigation.navigate('Signup')}>
        <View style={sharedStyles.backCircle}>
          <AntDesign name="arrowleft" size={28} color="#444" />
        </View>
      </TouchableOpacity>
      <View style={sharedStyles.authContentContainer}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primaryGradientLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24
          }}>
            <AntDesign name="mail" size={40} color={colors.primary} />
          </View>
        </View>
        
        <Text style={sharedStyles.authTitle}>Vérifiez votre email</Text>
        
        <Text style={[sharedStyles.loginText, { 
          marginBottom: 32, 
          textAlign: 'center',
          lineHeight: 22
        }]}>
          Entrez le code à 6 chiffres reçu dans votre email pour activer votre compte.
        </Text>

        {/* Code de vérification */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginBottom: 32,
          paddingHorizontal: 20
        }}>
          {verificationCode.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={{
                width: 45,
                height: 55,
                borderWidth: 2,
                borderColor: digit ? '#9A53C0' : '#E0E0E0',
                borderRadius: 12,
                textAlign: 'center',
                fontSize: 24,
                fontWeight: '600',
                color: '#383840',
                backgroundColor: '#fff'
              }}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
            />
          ))}
        </View>
        
        
        <View style={{ marginTop: 24, alignItems: 'center' }}>
          <Text style={[sharedStyles.loginText, { marginBottom: 12 }]}>
            Vous n'avez pas reçu le code ?
          </Text>
          <TouchableOpacity 
            onPress={handleResendEmail}
            disabled={resendDisabled}
          >
            <Text style={[
              sharedStyles.linkText, 
              { 
                opacity: resendDisabled ? 0.5 : 1,
                fontSize: 16
              }
            ]}>
              {resendDisabled 
                ? `Renvoyer (${countdown}s)` 
                : 'Renvoyer le code'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EmailVerificationScreen; 