import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import CustomHeader from '../../components/CustomHeader';

const HelpSupportScreen = ({ navigation }: any) => {
  const helpSections = [
    {
      title: 'Centre d\'aide',
      icon: 'help-circle',
      color: colors.primary,
      items: [
        {
          title: 'Comment réserver un service ?',
          description: 'Guide étape par étape pour réserver un service',
          action: () => {},
        },
        {
          title: 'Comment contacter un artisan ?',
          description: 'Méthodes pour communiquer avec les artisans',
          action: () => {},
        },
        {
          title: 'Comment annuler une réservation ?',
          description: 'Procédure d\'annulation et remboursement',
          action: () => {},
        },
      ],
    },
    {
      title: 'Support',
      icon: 'message-circle',
      color: colors.info,
      items: [
        {
          title: 'Contacter le support',
          description: 'Chat en direct avec notre équipe',
          action: () => {},
        },
        {
          title: 'Envoyer un email',
          description: 'support@artizone.com',
          action: () => Linking.openURL('mailto:support@artizone.com'),
        },
        {
          title: 'Appeler le support',
          description: '+33 1 23 45 67 89',
          action: () => Linking.openURL('tel:+33123456789'),
        },
      ],
    },
    {
      title: 'Informations légales',
      icon: 'file-text',
      color: colors.warning,
      items: [
        {
          title: 'Conditions d\'utilisation',
          description: 'Lire nos conditions d\'utilisation',
          action: () => {},
        },
        {
          title: 'Politique de confidentialité',
          description: 'Comment nous protégeons vos données',
          action: () => {},
        },
        {
          title: 'Mentions légales',
          description: 'Informations légales sur Artizone',
          action: () => {},
        },
      ],
    },
  ];

  const faqItems = [
    {
      question: 'Comment fonctionne Artizone ?',
      answer: 'Artizone est une plateforme qui met en relation particuliers et artisans. Vous pouvez rechercher des services, réserver des créneaux et payer en ligne.',
    },
    {
      question: 'Les artisans sont-ils vérifiés ?',
      answer: 'Oui, tous nos artisans passent par un processus de vérification rigoureux incluant la vérification d\'identité et des compétences.',
    },
    {
      question: 'Comment sont sécurisés les paiements ?',
      answer: 'Tous les paiements sont sécurisés par Stripe, leader mondial du paiement en ligne, avec chiffrement SSL.',
    },
    {
      question: 'Puis-je annuler une réservation ?',
      answer: 'Oui, vous pouvez annuler une réservation jusqu\'à 24h avant le service. Consultez nos conditions pour plus de détails.',
    },
  ];

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Aide et support"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sections d'aide */}
        {helpSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
                <Feather name={section.icon as any} size={20} color={colors.textInverse} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <View style={styles.sectionContent}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.helpItem}
                  onPress={item.action}
                >
                  <View style={styles.helpItemContent}>
                    <Text style={styles.helpItemTitle}>{item.title}</Text>
                    <Text style={styles.helpItemDescription}>{item.description}</Text>
                  </View>
                  <AntDesign name="right" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* FAQ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: colors.success }]}>
              <MaterialIcons name="question-answer" size={20} color={colors.textInverse} />
            </View>
            <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          </View>

          <View style={styles.sectionContent}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact rapide */}
        <View style={styles.quickContact}>
          <Text style={styles.quickContactTitle}>Besoin d'aide rapide ?</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Feather name="message-circle" size={20} color={colors.textInverse} />
            <Text style={styles.contactButtonText}>Chat en direct</Text>
          </TouchableOpacity>
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
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  helpItemContent: {
    flex: 1,
    marginRight: 16,
  },
  helpItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  helpItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  quickContact: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickContactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HelpSupportScreen; 