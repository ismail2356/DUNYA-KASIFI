import { createSlice } from '@reduxjs/toolkit';

/**
 * Görevler durumunun başlangıç değerleri
 */
const initialState = {
  availableQuests: [], // Mevcut görevler
  activeQuests: [], // Aktif görevler
  completedQuests: [], // Tamamlanan görevler
  questCategories: [
    { id: 'geography', name: 'Coğrafi Keşifler', icon: 'globe' },
    { id: 'culture', name: 'Kültürel Maceralar', icon: 'museum' },
    { id: 'language', name: 'Dil Öğrenme', icon: 'comment-dots' },
    { id: 'minigames', name: 'Mini Oyunlar', icon: 'gamepad' },
  ],
  loading: false,
  error: null,
};

/**
 * Görevler slice'ı
 */
const questsSlice = createSlice({
  name: 'quests',
  initialState,
  reducers: {
    // Görevleri yüklemeye başlama
    fetchQuestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Görevleri başarıyla yükleme
    fetchQuestsSuccess: (state, action) => {
      state.loading = false;
      state.availableQuests = action.payload;
    },
    
    // Görev yükleme hatası
    fetchQuestsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Görev başlatma
    startQuest: (state, action) => {
      const questId = action.payload;
      const quest = state.availableQuests.find(q => q.id === questId);
      
      if (quest && !state.activeQuests.some(q => q.id === questId)) {
        state.activeQuests.push({
          ...quest,
          startedAt: new Date().toISOString(),
          progress: 0,
        });
      }
    },
    
    // Görev ilerleme güncelleme
    updateQuestProgress: (state, action) => {
      const { questId, progress } = action.payload;
      const questIndex = state.activeQuests.findIndex(q => q.id === questId);
      
      if (questIndex !== -1) {
        state.activeQuests[questIndex].progress = progress;
        
        // Görev tamamlandı mı kontrol et
        if (progress >= 100) {
          const completedQuest = state.activeQuests[questIndex];
          state.completedQuests.push({
            ...completedQuest,
            completedAt: new Date().toISOString(),
          });
          state.activeQuests.splice(questIndex, 1);
        }
      }
    },
    
    // Görevi tamamlama
    completeQuest: (state, action) => {
      const questId = action.payload;
      const questIndex = state.activeQuests.findIndex(q => q.id === questId);
      
      if (questIndex !== -1) {
        const completedQuest = state.activeQuests[questIndex];
        state.completedQuests.push({
          ...completedQuest,
          progress: 100,
          completedAt: new Date().toISOString(),
        });
        state.activeQuests.splice(questIndex, 1);
      }
    },
    
    // Görevi iptal etme
    abandonQuest: (state, action) => {
      const questId = action.payload;
      const questIndex = state.activeQuests.findIndex(q => q.id === questId);
      
      if (questIndex !== -1) {
        state.activeQuests.splice(questIndex, 1);
      }
    },
    
    // Yeni görev ekleme (örneğin, yeni bir ülkeye gidildiğinde)
    addNewQuests: (state, action) => {
      const newQuests = action.payload;
      state.availableQuests = [
        ...state.availableQuests,
        ...newQuests.filter(newQuest => 
          !state.availableQuests.some(q => q.id === newQuest.id) &&
          !state.completedQuests.some(q => q.id === newQuest.id)
        ),
      ];
    },
    
    // Tüm görevleri sıfırlama (test veya yeni oyun için)
    resetQuests: (state) => {
      return initialState;
    },
  },
});

// Action'ları dışa aktar
export const {
  fetchQuestsStart,
  fetchQuestsSuccess,
  fetchQuestsFailure,
  startQuest,
  updateQuestProgress,
  completeQuest,
  abandonQuest,
  addNewQuests,
  resetQuests,
} = questsSlice.actions;

// Selector'ları dışa aktar
export const selectAllQuests = (state) => state.quests.availableQuests;
export const selectActiveQuests = (state) => state.quests.activeQuests;
export const selectCompletedQuests = (state) => state.quests.completedQuests;
export const selectQuestCategories = (state) => state.quests.questCategories;
export const selectQuestsByCategory = (state, categoryId) => 
  state.quests.availableQuests.filter(quest => quest.categoryId === categoryId);
export const selectQuestsLoading = (state) => state.quests.loading;
export const selectQuestsError = (state) => state.quests.error;

export default questsSlice.reducer; 