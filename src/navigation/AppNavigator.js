import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDeviceDetection } from '../services/DeviceDetectionContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/constants';

// Ekranlar (ileride oluşturulacak)
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import CharacterCreationScreen from '../screens/CharacterCreationScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import QuestsScreen from '../screens/QuestsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ARExperienceScreen from '../screens/ARExperienceScreen';
import PseudoARScreen from '../screens/PseudoARScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Ana tab navigasyonu
 */
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: COLORS.black,
          shadowOpacity: 0.1,
          shadowRadius: 5,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{
          tabBarLabel: 'Harita',
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Quests" 
        component={QuestsScreen} 
        options={{
          tabBarLabel: 'Görevler',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarLabel: 'Ayarlar',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Ana uygulama navigasyonu
 */
const AppNavigator = () => {
  const { hasARSupport, usePseudoAR } = useDeviceDetection();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="CharacterCreation" component={CharacterCreationScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      
      {/* AR deneyimi için koşullu yönlendirme */}
      {hasARSupport ? (
        <Stack.Screen name="ARExperience" component={ARExperienceScreen} />
      ) : (
        <Stack.Screen name="PseudoAR" component={PseudoARScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator; 