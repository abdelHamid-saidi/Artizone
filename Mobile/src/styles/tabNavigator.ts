import { Platform } from 'react-native';
import colors from './colors';

export const tabNavigatorStyles = {
  // Styles pour la barre d'onglets
  tabBar: {
    position: 'relative' as const,
    height: Platform.OS === 'ios' ? 80 : 60,
    backgroundColor: Platform.OS === 'ios' ? colors.tabBackground : colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    elevation: Platform.OS === 'android' ? 8 : 0,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 8,
    paddingHorizontal: 10,
  },

  // Styles pour les badges
  badge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
    backgroundColor: colors.badgeBackground,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: colors.background,
  },

  badgeText: {
    color: colors.badgeText,
    fontSize: 10,
    fontWeight: 'bold' as const,
  },

  // Styles pour les labels
  label: {
    fontSize: 11,
    fontWeight: '600' as const,
    marginTop: 2,
  },

  // Styles pour les icônes
  icon: {
    marginTop: 0,
  },

  // Styles pour les items
  item: {
    paddingVertical: 8,
  },

  // Couleurs
  colors: {
    active: colors.tabActive,
    inactive: colors.tabInactive,
  },
};

export default tabNavigatorStyles; 