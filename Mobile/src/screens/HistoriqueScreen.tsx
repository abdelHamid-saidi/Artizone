import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import colors from '../styles/colors';
import CustomHeader from '../components/CustomHeader';

const HistoriqueScreen = ({ navigation }: any) => {
  const historiqueData = [
    {
      id: 1,
      type: 'Réservation',
      titre: 'Plomberie - Réparation fuite',
      artisan: 'Jean Dupont',
      date: '15 Jan 2024',
      statut: 'Terminé',
      montant: '120€',
      icon: 'build',
      color: '#4ECDC4',
    },
    {
      id: 2,
      type: 'Service',
      titre: 'Électricité - Installation prise',
      artisan: 'Marie Martin',
      date: '10 Jan 2024',
      statut: 'En cours',
      montant: '85€',
      icon: 'flash-on',
      color: '#FFD93D',
    },
    {
      id: 3,
      type: 'Réservation',
      titre: 'Ménage - Nettoyage complet',
      artisan: 'Sophie Bernard',
      date: '05 Jan 2024',
      statut: 'Terminé',
      montant: '65€',
      icon: 'cleaning-services',
      color: '#6C5CE7',
    },
  ];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Terminé':
        return '#4CAF50';
      case 'En cours':
        return '#FF9800';
      case 'Annulé':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Historique"
        showBack={false}
        onBack={() => navigation.goBack()}
        showNotification={true}
        notificationCount={3}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {historiqueData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.historiqueCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.serviceIcon, { backgroundColor: item.color }]}>
                <MaterialIcons name={item.icon as any} size={24} color="#fff" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.serviceType}>{item.type}</Text>
                <Text style={styles.serviceTitle}>{item.titre}</Text>
                <Text style={styles.artisanName}>Par {item.artisan}</Text>
              </View>
              <View style={styles.cardActions}>
                <Text style={styles.montant}>{item.montant}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statut) }]}>
                  <Text style={styles.statusText}>{item.statut}</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>{item.date}</Text>
              <TouchableOpacity style={styles.detailButton}>
                <Text style={styles.detailButtonText}>Voir détails</Text>
                <AntDesign name="right" size={12} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {historiqueData.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Aucun historique</Text>
            <Text style={styles.emptySubtitle}>
              Vos services et réservations apparaîtront ici
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
  historiqueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  serviceType: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  artisanName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  montant: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 12,
    color: colors.primary,
    marginRight: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default HistoriqueScreen; 