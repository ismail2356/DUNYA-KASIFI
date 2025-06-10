import { createSlice } from '@reduxjs/toolkit';

/**
 * Ayarlar durumunun başlangıç değerleri
 */
const initialState = {
  general: {
    language: 'tr', // Uygulama dili
    theme: 'light', // Uygulama teması ('light', 'dark', 'auto')
    soundEnabled: true, // Ses efektleri
    musicEnabled: true, // Müzik
    musicVolume: 0.7, // Müzik ses seviyesi (0-1)
    soundVolume: 0.8, // Ses efektleri ses seviyesi (0-1)
    vibrationEnabled: true, // Titreşim
    notificationsEnabled: true, // Bildirimler
  },
  accessibility: {
    fontSize: 'medium', // Yazı tipi boyutu ('small', 'medium', 'large', 'xlarge')
    highContrast: false, // Yüksek kontrast modu
    reduceMotion: false, // Hareketi azaltma
    screenReaderHints: false, // Ekran okuyucu ipuçları
  },
  eyeHealth: {
    remindersEnabled: true, // Göz dinlendirme hatırlatıcıları
    reminderInterval: 20, // Hatırlatma aralığı (dakika)
    blueFilterEnabled: false, // Mavi ışık filtresi
    blueFilterIntensity: 0.3, // Mavi ışık filtresi yoğunluğu (0-1)
    autoBrightness: true, // Otomatik parlaklık
  },
  parentalControls: {
    enabled: false, // Ebeveyn kontrolleri etkin mi
    timeLimit: 60, // Günlük kullanım süresi limiti (dakika)
    contentFilter: 'moderate', // İçerik filtresi seviyesi ('low', 'moderate', 'high')
    passwordProtected: false, // Şifre korumalı ayarlar
    password: '', // Ebeveyn kontrol şifresi
  },
  performance: {
    graphicsQuality: 'medium', // Grafik kalitesi ('low', 'medium', 'high')
    loadingOptimization: true, // Yükleme optimizasyonu
    batteryOptimization: true, // Pil optimizasyonu
    dataUsageOptimization: false, // Veri kullanımı optimizasyonu
  },
  privacy: {
    locationTracking: true, // Konum takibi
    analyticsEnabled: true, // Analitik veri toplama
    crashReporting: true, // Çökme raporlama
    personalization: true, // Kişiselleştirme
  },
};

/**
 * Ayarlar slice'ı
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Genel ayarları güncelleme
    updateGeneralSettings: (state, action) => {
      state.general = {
        ...state.general,
        ...action.payload,
      };
    },
    
    // Erişilebilirlik ayarlarını güncelleme
    updateAccessibilitySettings: (state, action) => {
      state.accessibility = {
        ...state.accessibility,
        ...action.payload,
      };
    },
    
    // Göz sağlığı ayarlarını güncelleme
    updateEyeHealthSettings: (state, action) => {
      state.eyeHealth = {
        ...state.eyeHealth,
        ...action.payload,
      };
    },
    
    // Ebeveyn kontrollerini güncelleme
    updateParentalControls: (state, action) => {
      state.parentalControls = {
        ...state.parentalControls,
        ...action.payload,
      };
    },
    
    // Performans ayarlarını güncelleme
    updatePerformanceSettings: (state, action) => {
      state.performance = {
        ...state.performance,
        ...action.payload,
      };
    },
    
    // Gizlilik ayarlarını güncelleme
    updatePrivacySettings: (state, action) => {
      state.privacy = {
        ...state.privacy,
        ...action.payload,
      };
    },
    
    // Dil değiştirme
    changeLanguage: (state, action) => {
      state.general.language = action.payload;
    },
    
    // Tema değiştirme
    changeTheme: (state, action) => {
      state.general.theme = action.payload;
    },
    
    // Ses durumunu değiştirme
    toggleSound: (state) => {
      state.general.soundEnabled = !state.general.soundEnabled;
    },
    
    // Müzik durumunu değiştirme
    toggleMusic: (state) => {
      state.general.musicEnabled = !state.general.musicEnabled;
    },
    
    // Tüm ayarları sıfırlama
    resetSettings: (state) => {
      return initialState;
    },
    
    // Ebeveyn kontrol şifresini değiştirme
    changeParentalPassword: (state, action) => {
      state.parentalControls.password = action.payload;
      state.parentalControls.passwordProtected = action.payload !== '';
    },
  },
});

// Action'ları dışa aktar
export const {
  updateGeneralSettings,
  updateAccessibilitySettings,
  updateEyeHealthSettings,
  updateParentalControls,
  updatePerformanceSettings,
  updatePrivacySettings,
  changeLanguage,
  changeTheme,
  toggleSound,
  toggleMusic,
  resetSettings,
  changeParentalPassword,
} = settingsSlice.actions;

// Selector'ları dışa aktar
export const selectGeneralSettings = (state) => state.settings.general;
export const selectAccessibilitySettings = (state) => state.settings.accessibility;
export const selectEyeHealthSettings = (state) => state.settings.eyeHealth;
export const selectParentalControls = (state) => state.settings.parentalControls;
export const selectPerformanceSettings = (state) => state.settings.performance;
export const selectPrivacySettings = (state) => state.settings.privacy;
export const selectLanguage = (state) => state.settings.general.language;
export const selectTheme = (state) => state.settings.general.theme;

export default settingsSlice.reducer; 