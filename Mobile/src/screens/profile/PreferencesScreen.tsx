import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import CustomHeader from '../../components/CustomHeader';

const PreferencesScreen = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState({
    notifications: {
      push: true,
      email: false,
      sms: true,
    },
    privacy: {
      profileVisible: true,
      locationSharing: false,
    },
    app: {
      darkMode: false,
      autoLogin: true,
    },
  });

  const handleToggle = (category: string, key: string) => {
    setPreferences(prev => {
      const newPreferences = { ...prev };
      if (category === 'notifications') {
        newPreferences.notifications = {
          ...newPreferences.notifications,
          [key]: !newPreferences.notifications[key as keyof typeof newPreferences.notifications],
        };
      } else if (category === 'privacy') {
        newPreferences.privacy = {
          ...newPreferences.privacy,
          [key]: !newPreferences.privacy[key as keyof typeof newPreferences.privacy],
        };
      } else if (category === 'app') {
        newPreferences.app = {
          ...newPreferences.app,
          [key]: !newPreferences.app[key as keyof typeof newPreferences.app],
        };
      }
      return newPreferences;
    });
  };

  const handleResetPreferences = () => {
    Alert.alert(
      'Réinitialiser les préférences',
      'Êtes-vous sûr de vouloir remettre toutes les préférences à zéro ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Réinitialiser',
          style: 'destructive',
          onPress: () => {
            setPreferences({
              notifications: {
                push: true,
                email: false,
                sms: true,
              },
              privacy: {
                profileVisible: true,
                locationSharing: false,
              },
              app: {
                darkMode: false,
                autoLogin: true,
              },
            });
          },
        },
      ]
    );
  };

  const preferenceSections = [
    {
      title: 'Notifications',
      icon: 'bell',
      color: colors.primary,
      items: [
        {
          key: 'push',
          label: 'Notifications push',
          description: 'Recevoir des notifications sur votre appareil',
          value: preferences.notifications.push,
        },
        {
          key: 'email',
          label: 'Notifications par email',
          description: 'Recevoir des notifications par email',
          value: preferences.notifications.email,
        },
        {
          key: 'sms',
          label: 'Notifications par SMS',
          description: 'Recevoir des notifications par SMS',
          value: preferences.notifications.sms,
        },
      ],
      category: 'notifications',
    },
    {
      title: 'Confidentialité',
      icon: 'shield',
      color: colors.warning,
      items: [
        {
          key: 'profileVisible',
          label: 'Profil visible',
          description: 'Permettre aux artisans de voir votre profil',
          value: preferences.privacy.profileVisible,
        },
        {
          key: 'locationSharing',
          label: 'Partage de localisation',
          description: 'Partager votre localisation avec les artisans',
          value: preferences.privacy.locationSharing,
        },
      ],
      category: 'privacy',
    },
    {
      title: 'Application',
      icon: 'settings',
      color: colors.info,
      items: [
        {
          key: 'darkMode',
          label: 'Mode sombre',
          description: 'Activer le thème sombre',
          value: preferences.app.darkMode,
        },
        {
          key: 'autoLogin',
          label: 'Connexion automatique',
          description: 'Se connecter automatiquement',
          value: preferences.app.autoLogin,
        },
      ],
      category: 'app',
    },
  ];

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Préférences"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {preferenceSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
                <Feather name={section.icon as any} size={20} color={colors.textInverse} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <View style={styles.sectionContent}>
              {section.items.map((item) => (
                <View key={item.key} style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Text style={styles.preferenceLabel}>{item.label}</Text>
                    <Text style={styles.preferenceDescription}>{item.description}</Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={() => handleToggle(section.category, item.key)}
                    trackColor={{ false: colors.borderLight, true: section.color }}
                    thumbColor={colors.background}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Bouton réinitialiser */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPreferences}>
          <MaterialIcons name="restore" size={20} color={colors.error} />
          <Text style={styles.resetButtonText}>Réinitialiser les préférences</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  sectionContent: {
    padding: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resetButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PreferencesScreen; 