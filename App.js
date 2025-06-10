import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as StoreProvider } from 'react-redux';
import { registerRootComponent } from 'expo';

import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store';
import { DeviceDetectionProvider } from './src/services/DeviceDetectionContext';

/**
 * Dünya Kaşifi uygulamasının ana bileşeni.
 * Temel uygulama yapısını ve global sağlayıcıları içerir.
 */
const App = () => {
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <DeviceDetectionProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </DeviceDetectionProvider>
      </SafeAreaProvider>
    </StoreProvider>
  );
};

// Expo uygulaması olarak kaydet
registerRootComponent(App);

export default App; 