import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import questsReducer from './slices/questsSlice';
import mapReducer from './slices/mapSlice';
import settingsReducer from './slices/settingsSlice';

/**
 * Redux store yapılandırması.
 * Tüm reducer'ları birleştirir ve store'u yapılandırır.
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
    quests: questsReducer,
    map: mapReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Store tipleri için TypeScript desteği (ileride eklenecek)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch; 