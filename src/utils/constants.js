/**
 * Uygulama sabitleri
 */

// Tema renkleri
export const COLORS = {
  // Ana renkler
  primary: '#1E88E5',
  secondary: '#4CAF50',
  accent: '#FF9800',
  
  // Nötr renkler
  white: '#FFFFFF',
  black: '#000000',
  grey: '#9E9E9E',
  lightGrey: '#E0E0E0',
  darkGrey: '#616161',
  
  // Durum renkleri
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#03A9F4',
  
  // Arka plan renkleri
  background: '#F5F5F5',
  card: '#FFFFFF',
  
  // Metin renkleri
  text: '#333333',
  textLight: '#666666',
  textDark: '#212121',
  textMuted: '#9E9E9E',
};

// Yazı tipi boyutları
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 32,
};

// Boşluk değerleri
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Kenar yuvarlaklık değerleri
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
};

// Gölge stilleri
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Ekran boyutları
export const SCREEN_SIZES = {
  small: 320,
  medium: 375,
  large: 414,
  tablet: 768,
};

// Animasyon süreleri
export const ANIMATION_DURATIONS = {
  short: 200,
  medium: 300,
  long: 500,
};

// API sabitleri
export const API = {
  baseUrl: 'https://api.dunyakasifi.com',
  timeout: 10000,
};

// Depolama anahtarları
export const STORAGE_KEYS = {
  userToken: 'user_token',
  userProfile: 'user_profile',
  appSettings: 'app_settings',
  onboardingCompleted: 'onboarding_completed',
};

// Uygulama sabitleri
export const APP_CONSTANTS = {
  appName: 'Dünya Kaşifi',
  appVersion: '1.0.0',
  buildNumber: '1',
  contactEmail: 'iletisim@dunyakasifi.com',
  privacyPolicyUrl: 'https://dunyakasifi.com/gizlilik',
  termsOfServiceUrl: 'https://dunyakasifi.com/kullanim-kosullari',
}; 