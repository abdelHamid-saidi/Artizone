import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LogoArtizone from '../../components/LogoArtizone';
import Loader from '../../components/Loader';
import sharedStyles from '../../styles/shared';
import colors from '../../styles/colors';
import { storageService } from '../../services/storage';

const { height } = Dimensions.get('window');

// Définition du type des routes du stack
type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Policy: undefined;
  ForgotPassword: undefined;
  EmailVerification: undefined;
  Home: undefined;
};

const SplashScreen = () => {
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Animation du logo et du texte
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
      ]),
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();

    // Vérifier l'authentification et naviguer vers la page appropriée
    const checkAuthAndNavigate = async () => {
      try {
        const isAuthenticated = await storageService.isAuthenticated();
        
        // Navigation automatique après 2 secondes
        setTimeout(() => {
          if (isAuthenticated) {
            console.log('🔐 Utilisateur authentifié, navigation vers Home');
            navigation.replace('Home');
          } else {
            console.log('🔓 Utilisateur non authentifié, navigation vers Landing');
            navigation.replace('Landing');
          }
        }, 3500);
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        // En cas d'erreur, rediriger vers Landing par défaut
        setTimeout(() => {
          navigation.navigate('Landing');
        }, 3500);
      }
    };

    checkAuthAndNavigate();
  }, [logoScale, logoOpacity, loaderOpacity, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <LogoArtizone />
      </Animated.View>
      <Animated.View style={[styles.loaderContainer, { opacity: loaderOpacity }]}> 
        <Loader />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: height * 0.12,
    paddingBottom: height * 0.08,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
});

export default SplashScreen; 