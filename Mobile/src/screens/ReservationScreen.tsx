import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';

const ReservationScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <CustomHeader title="Réservation" 
        showBack={false}
        showNotification={true}
        notificationCount={3}
        onNotificationPress={() => {}} 
       />
      <View style={styles.content}>
        <Text style={styles.text}>Ceci est un écran placeholder "Réservation".</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});

export default ReservationScreen; 