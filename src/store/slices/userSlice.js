import { createSlice } from '@reduxjs/toolkit';

/**
 * Kullanıcı durumunun başlangıç değerleri
 */
const initialState = {
  isAuthenticated: false,
  profile: {
    id: null,
    username: '',
    avatar: {
      gender: 'boy', // 'boy' veya 'girl'
      hairStyle: 0,
      hairColor: '#8B4513',
      skinColor: '#F5D0A9',
      eyeColor: '#8B4513',
      outfit: 0,
    },
    equipment: {
      binoculars: 0,
      compass: 0,
      notebook: 0,
      camera: 0,
    },
    vehicle: 0, // Seçilen araç indeksi
    certificate: {
      name: '',
      date: null,
      id: '',
    },
  },
  progress: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    completedQuests: 0,
    visitedCountries: [],
    collectedItems: [],
    badges: [],
  },
  passport: {
    stamps: [], // Ziyaret edilen ülke damgaları
    languageStickers: [], // Öğrenilen dil çıkartmaları
  },
  settings: {
    parentalControls: {
      enabled: false,
      timeLimit: 60, // Dakika cinsinden
      contentFilter: 'moderate', // 'low', 'moderate', 'high'
      password: '',
    },
  },
};

/**
 * Kullanıcı slice'ı
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Kullanıcı girişi
    login: (state, action) => {
      state.isAuthenticated = true;
      state.profile.id = action.payload.id;
      state.profile.username = action.payload.username;
    },
    
    // Kullanıcı çıkışı
    logout: (state) => {
      return initialState;
    },
    
    // Avatar güncelleme
    updateAvatar: (state, action) => {
      state.profile.avatar = {
        ...state.profile.avatar,
        ...action.payload,
      };
    },
    
    // Ekipman güncelleme
    updateEquipment: (state, action) => {
      state.profile.equipment = {
        ...state.profile.equipment,
        ...action.payload,
      };
    },
    
    // Araç seçimi
    selectVehicle: (state, action) => {
      state.profile.vehicle = action.payload;
    },
    
    // Sertifika oluşturma
    createCertificate: (state, action) => {
      state.profile.certificate = {
        ...state.profile.certificate,
        ...action.payload,
        date: new Date().toISOString(),
      };
    },
    
    // XP kazanma ve seviye atlama
    gainXP: (state, action) => {
      const xpGained = action.payload;
      state.progress.xp += xpGained;
      
      // Seviye atlama kontrolü
      while (state.progress.xp >= state.progress.xpToNextLevel) {
        state.progress.xp -= state.progress.xpToNextLevel;
        state.progress.level += 1;
        state.progress.xpToNextLevel = Math.floor(state.progress.xpToNextLevel * 1.5);
      }
    },
    
    // Görev tamamlama
    completeQuest: (state) => {
      state.progress.completedQuests += 1;
    },
    
    // Ülke ziyareti
    visitCountry: (state, action) => {
      const countryId = action.payload;
      if (!state.progress.visitedCountries.includes(countryId)) {
        state.progress.visitedCountries.push(countryId);
      }
    },
    
    // Eşya toplama
    collectItem: (state, action) => {
      const itemId = action.payload;
      if (!state.progress.collectedItems.includes(itemId)) {
        state.progress.collectedItems.push(itemId);
      }
    },
    
    // Rozet kazanma
    earnBadge: (state, action) => {
      const badgeId = action.payload;
      if (!state.progress.badges.includes(badgeId)) {
        state.progress.badges.push(badgeId);
      }
    },
    
    // Pasaporta damga ekleme
    addStamp: (state, action) => {
      const stamp = action.payload;
      state.passport.stamps.push(stamp);
    },
    
    // Dil çıkartması ekleme
    addLanguageSticker: (state, action) => {
      const sticker = action.payload;
      state.passport.languageStickers.push(sticker);
    },
    
    // Ebeveyn kontrollerini güncelleme
    updateParentalControls: (state, action) => {
      state.settings.parentalControls = {
        ...state.settings.parentalControls,
        ...action.payload,
      };
    },
  },
});

// Action'ları dışa aktar
export const {
  login,
  logout,
  updateAvatar,
  updateEquipment,
  selectVehicle,
  createCertificate,
  gainXP,
  completeQuest,
  visitCountry,
  collectItem,
  earnBadge,
  addStamp,
  addLanguageSticker,
  updateParentalControls,
} = userSlice.actions;

// Selector'ları dışa aktar
export const selectUser = (state) => state.user;
export const selectProfile = (state) => state.user.profile;
export const selectProgress = (state) => state.user.progress;
export const selectPassport = (state) => state.user.passport;
export const selectParentalControls = (state) => state.user.settings.parentalControls;

export default userSlice.reducer; 