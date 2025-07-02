import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';

const NotificationsScreen = ({ navigation }: any) => {
  const notificationsData = [
    {
      id: 1,
      type: 'reservation',
      titre: 'Réservation confirmée',
      message: 'Votre réservation de plomberie a été confirmée par Jean Dupont',
      date: 'Il y a 2h',
      lu: false,
      icon: 'check-circle',
      color: '#4CAF50',
    },
    {
      id: 2,
      type: 'message',
      titre: 'Nouveau message',
      message: 'Marie Martin vous a envoyé un message concernant votre demande',
      date: 'Il y a 4h',
      lu: false,
      icon: 'message',
      color: '#2196F3',
    },
    {
      id: 3,
      type: 'reminder',
      titre: 'Rappel de rendez-vous',
      message: 'Votre rendez-vous avec Sophie Bernard est dans 1 heure',
      date: 'Il y a 1j',
      lu: true,
      icon: 'schedule',
      color: '#FF9800',
    },
    {
      id: 4,
      type: 'promo',
      titre: 'Offre spéciale',
      message: '-20% sur tous les services de ménage cette semaine',
      date: 'Il y a 2j',
      lu: true,
      icon: 'local-offer',
      color: '#E91E63',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return 'check-circle';
      case 'message':
        return 'message';
      case 'reminder':
        return 'schedule';
      case 'promo':
        return 'local-offer';
      default:
        return 'notifications';
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Notifications"
        showBack={true}
        onBack={() => navigation.goBack()}
        showNotification={false}
      />
      <View style={styles.content}>
        <Text style={styles.text}>Aucune notification pour le moment.</Text>
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

export default NotificationsScreen; 