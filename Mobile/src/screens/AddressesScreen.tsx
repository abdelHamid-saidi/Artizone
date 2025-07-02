import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';

const AddressesScreen = ({ navigation }: any) => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Domicile',
      address: '123 Rue de la Paix',
      complement: 'Appartement 4B',
      city: 'Paris',
      postalCode: '75001',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Bureau',
      address: '456 Avenue des Champs',
      complement: 'Étage 3',
      city: 'Lyon',
      postalCode: '69001',
      isDefault: false,
    },
  ]);

  const handleAddAddress = () => {
    Alert.alert('Ajouter une adresse', 'Fonctionnalité à implémenter');
  };

  const handleEditAddress = (address: any) => {
    Alert.alert('Modifier l\'adresse', `Modifier ${address.type}`);
  };

  const handleDeleteAddress = (address: any) => {
    Alert.alert(
      'Supprimer l\'adresse',
      `Êtes-vous sûr de vouloir supprimer l'adresse "${address.type}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(addr => addr.id !== address.id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (address: any) => {
    setAddresses(
      addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === address.id,
      }))
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Mes adresses"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bouton ajouter */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <Feather name="plus" size={20} color={colors.textInverse} />
          <Text style={styles.addButtonText}>Ajouter une adresse</Text>
        </TouchableOpacity>

        {/* Liste des adresses */}
        <View style={styles.addressesList}>
          {addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.addressType}>
                  <MaterialIcons 
                    name={address.type === 'Domicile' ? 'home' : 'business'} 
                    size={20} 
                    color={colors.primary} 
                  />
                  <Text style={styles.addressTypeText}>{address.type}</Text>
                  {address.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Par défaut</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addressActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditAddress(address)}
                  >
                    <Feather name="edit-2" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteAddress(address)}
                  >
                    <Feather name="trash-2" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.addressContent}>
                <Text style={styles.addressText}>{address.address}</Text>
                {address.complement && (
                  <Text style={styles.complementText}>{address.complement}</Text>
                )}
                <Text style={styles.cityText}>
                  {address.postalCode} {address.city}
                </Text>
              </View>

              {!address.isDefault && (
                <TouchableOpacity 
                  style={styles.setDefaultButton}
                  onPress={() => handleSetDefault(address)}
                >
                  <Text style={styles.setDefaultText}>Définir par défaut</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {addresses.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="location-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Aucune adresse enregistrée</Text>
            <Text style={styles.emptySubtitle}>
              Ajoutez votre première adresse pour faciliter vos réservations
            </Text>
          </View>
        )}
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
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addressesList: {
    gap: 16,
  },
  addressCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  defaultBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '500',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  addressContent: {
    gap: 4,
  },
  addressText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  complementText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cityText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  setDefaultButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default AddressesScreen; 