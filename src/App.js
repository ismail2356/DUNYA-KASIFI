import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as StoreProvider } from 'react-redux';

import AppNavigator from './navigation/AppNavigator';
import { store } from './store';
import { DeviceDetectionProvider } from './services/DeviceDetectionContext';

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

export default App; 