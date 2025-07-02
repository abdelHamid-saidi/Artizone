import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import CustomHeader from '../../components/CustomHeader';
import LogoArtizone from '../../components/LogoArtizone';

const AboutScreen = ({ navigation }: any) => {
  const appInfo = {
    version: '1.0.0',
    build: '2024.1.0',
    lastUpdate: '15 janvier 2024',
  };

  const aboutSections = [
    {
      title: 'À propos d\'Artizone',
      content: 'Artizone est une plateforme innovante qui connecte particuliers et artisans de qualité. Notre mission est de simplifier l\'accès aux services artisanaux tout en garantissant la satisfaction des utilisateurs.',
    },
    {
      title: 'Notre mission',
      content: 'Faciliter la mise en relation entre particuliers et artisans qualifiés, en offrant une expérience utilisateur simple, sécurisée et transparente.',
    },
    {
      title: 'Nos valeurs',
      content: 'Qualité, transparence, confiance et innovation sont au cœur de notre démarche. Nous nous engageons à offrir le meilleur service possible.',
    },
  ];

  const teamMembers = [
    {
      name: 'Équipe Artizone',
      role: 'Développement et support',
      description: 'Une équipe passionnée dédiée à votre satisfaction',
    },
  ];

  const socialLinks = [
    {
      name: 'Site web',
      url: 'https://artizone.com',
      icon: 'globe',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/artizone',
      icon: 'facebook',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/artizone',
      icon: 'twitter',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/artizone',
      icon: 'instagram',
    },
  ];

  const handleSocialLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      // Gérer l'erreur si l'URL ne peut pas être ouverte
    });
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="À propos"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Logo et version */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <LogoArtizone />
          </View>
          <Text style={styles.versionText}>Version {appInfo.version}</Text>
          <Text style={styles.buildText}>Build {appInfo.build}</Text>
          <Text style={styles.updateText}>Dernière mise à jour : {appInfo.lastUpdate}</Text>
        </View>

        {/* Sections À propos */}
        {aboutSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        {/* Équipe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notre équipe</Text>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamMember}>
              <View style={styles.memberAvatar}>
                <MaterialIcons name="group" size={24} color={colors.primary} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberDescription}>{member.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Réseaux sociaux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suivez-nous</Text>
          <View style={styles.socialLinks}>
            {socialLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialButton}
                onPress={() => handleSocialLink(link.url)}
              >
                <Feather name={link.icon as any} size={20} color={colors.primary} />
                <Text style={styles.socialButtonText}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Informations légales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations légales</Text>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalItemText}>Conditions d'utilisation</Text>
            <AntDesign name="right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalItemText}>Politique de confidentialité</Text>
            <AntDesign name="right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalItemText}>Mentions légales</Text>
            <AntDesign name="right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © 2024 Artizone. Tous droits réservés.
          </Text>
          <Text style={styles.copyrightSubtext}>
            Développé avec ❤️ pour connecter artisans et particuliers
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
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 16,
  },
  versionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  buildText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  updateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },
  memberDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  socialLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  legalItemText: {
    fontSize: 16,
    color: colors.text,
  },
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  copyrightText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  copyrightSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default AboutScreen; 