import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import sharedStyles from '../styles/shared';
import colors from '../styles/colors';

const LogoArtizone = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Logo Artizone"
      />
      <Text style={styles.text}>ARTIZONE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 35
    ,
  },
  logo: {
    width: 120,
    height: 120,
  },
  text: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    letterSpacing: 2,
  },
});

export default LogoArtizone; 