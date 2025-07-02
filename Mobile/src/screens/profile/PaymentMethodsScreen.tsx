import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import CustomHeader from '../../components/CustomHeader';

const PaymentMethodsScreen = ({ navigation }: any) => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'Carte bancaire',
      name: 'Visa ****1234',
      expiry: '12/25',
      isDefault: true,
      brand: 'visa',
    },
    {
      id: 2,
      type: 'Carte bancaire',
      name: 'Mastercard ****5678',
      expiry: '08/26',
      isDefault: false,
      brand: 'mastercard',
    },
  ]);

  const handleAddPaymentMethod = () => {
    Alert.alert('Ajouter un moyen de paiement', 'Fonctionnalité à implémenter');
  };

  const handleDeletePaymentMethod = (method: any) => {
    Alert.alert(
      'Supprimer le moyen de paiement',
      `Êtes-vous sûr de vouloir supprimer ${method.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(pm => pm.id !== method.id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (method: any) => {
    setPaymentMethods(
      paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === method.id,
      }))
    );
  };

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return 'credit-card';
      case 'mastercard':
        return 'credit-card';
      default:
        return 'credit-card';
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Moyens de paiement"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bouton ajouter */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPaymentMethod}>
          <Feather name="plus" size={20} color={colors.textInverse} />
          <Text style={styles.addButtonText}>Ajouter un moyen de paiement</Text>
        </TouchableOpacity>

        {/* Liste des moyens de paiement */}
        <View style={styles.paymentMethodsList}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethodCard}>
              <View style={styles.paymentMethodHeader}>
                <View style={styles.paymentMethodInfo}>
                  <MaterialIcons 
                    name={getBrandIcon(method.brand) as any} 
                    size={24} 
                    color={colors.primary} 
                  />
                  <View style={styles.paymentMethodDetails}>
                    <Text style={styles.paymentMethodName}>{method.name}</Text>
                    <Text style={styles.paymentMethodExpiry}>Expire {method.expiry}</Text>
                  </View>
                </View>
                <View style={styles.paymentMethodActions}>
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Par défaut</Text>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeletePaymentMethod(method)}
                  >
                    <Feather name="trash-2" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              {!method.isDefault && (
                <TouchableOpacity 
                  style={styles.setDefaultButton}
                  onPress={() => handleSetDefault(method)}
                >
                  <Text style={styles.setDefaultText}>Définir par défaut</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {paymentMethods.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="credit-card-off" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>Aucun moyen de paiement</Text>
            <Text style={styles.emptySubtitle}>
              Ajoutez votre premier moyen de paiement pour faciliter vos achats
            </Text>
          </View>
        )}

        {/* Informations de sécurité */}
        <View style={styles.securityInfo}>
          <View style={styles.securityHeader}>
            <Feather name="shield" size={20} color={colors.success} />
            <Text style={styles.securityTitle}>Paiements sécurisés</Text>
          </View>
          <Text style={styles.securityText}>
            Toutes vos informations de paiement sont chiffrées et sécurisées selon les standards PCI DSS.
          </Text>
        </View>
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
  paymentMethodsList: {
    gap: 16,
    marginBottom: 20,
  },
  paymentMethodCard: {
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
  paymentMethodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodDetails: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  paymentMethodExpiry: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paymentMethodActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  actionButton: {
    padding: 8,
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
  securityInfo: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default PaymentMethodsScreen; 