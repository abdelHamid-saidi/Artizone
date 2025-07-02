import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const { width, height } = Dimensions.get('window');

// Variables CSS réutilisables
export const SPACING = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 15,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 28,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Styles partageables
export const sharedStyles = StyleSheet.create({
  // Layouts
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  
  authContainer: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.xl,
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 3,
    paddingBottom: 30,
  },
  
  authContentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 120,
    zIndex: 2,
  },
  
  textContainer: {
    marginBottom: SPACING.xxl,
    alignItems: 'center',
  },
  
  // Boutons
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  
  buttonText: {
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: FONT_SIZES.xl,
    letterSpacing: 1,
  },
  
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: FONT_SIZES.xl,
    letterSpacing: 1,
  },
  
  // Bouton retour
  backButton: {
    position: 'absolute',
    top: 56,
    left: SPACING.xl,
    zIndex: 3,
  },
  
  backCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  // Textes
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  
  authTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  bodyText: {
    fontSize: FONT_SIZES.md,
    color: colors.text,
    lineHeight: 20,
  },
  
  captionText: {
    fontSize: FONT_SIZES.sm,
    color: colors.textSecondary,
  },
  
  linkText: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  
  orText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.md,
    marginTop: SPACING.xs,
  },
  
  forgotText: {
    color: colors.text,
    fontWeight: '500',
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.xxl,
    marginTop: SPACING.xs,
  },
  
  // Formulaires
  inputContainer: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  
  input: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.lg,
    color: colors.text,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  
  inputError: {
    borderColor: colors.error,
  },
  
  errorText: {
    color: colors.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
  },
  
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    paddingRight: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  eyeIcon: {
    padding: SPACING.xs,
  },
  
  // Navigation
  loginContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  
  loginText: {
    color: colors.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  
  // Politique de confidentialité
  policyContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: SPACING.xxxl,
    marginTop: 4,
  },
  
  policyText: {
    color: colors.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  
  policyLink: {
    color: colors.primaryGradient,
    fontWeight: '700',
    fontSize: FONT_SIZES.md,
    marginLeft: 2,
    marginRight: SPACING.xs,
  },
  
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 6,
    marginRight: 6,
  },
  
  // Images
  waveImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: 480,
    zIndex: 1,
  },
  
  authWaveImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: 505,
    zIndex: 1,
  },
  
  illustrationImage: {
    position: 'absolute',
    top: 130,
    left: width * 0.5 - 140,
    width: 280,
    height: 220,
    zIndex: 2,
  },
  
  // Utilitaires
  fullWidth: {
    width: '100%',
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  marginBottom: {
    marginBottom: SPACING.md,
  },
  
  marginTop: {
    marginTop: SPACING.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: SPACING.xl,
  },
  
  paddingVertical: {
    paddingVertical: SPACING.md,
  },
});

// Fonctions utilitaires
export const getResponsiveWidth = (percentage: number) => width * (percentage / 100);
export const getResponsiveHeight = (percentage: number) => height * (percentage / 100);

export default sharedStyles; 