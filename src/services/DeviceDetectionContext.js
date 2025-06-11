import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';

// Context oluşturma
const DeviceDetectionContext = createContext();

/**
 * Cihaz algılama sağlayan basitleştirilmiş provider bileşeni.
 * APK build için sensör bağımlılıkları kaldırıldı.
 */
export const DeviceDetectionProvider = ({ children }) => {
  // Cihaz özellikleri durumları
  const [hasARSupport, setHasARSupport] = useState(false);
  const [hasSensors, setHasSensors] = useState(false);
  const [sensorData, setSensorData] = useState({
    gyroscope: { x: 0, y: 0, z: 0 },
    accelerometer: { x: 0, y: 0, z: 0 }
  });

  // AR desteğini kontrol etme
  useEffect(() => {
    checkARSupport();
    checkSensorsAvailability();
  }, []);

  // AR desteğini kontrol etme fonksiyonu
  const checkARSupport = async () => {
    try {
      // Platform'a göre AR desteği kontrolü
      if (Platform.OS === 'ios') {
        // iOS için ARKit desteği kontrolü
        setHasARSupport(false); // APK build için false
      } else if (Platform.OS === 'android') {
        // Android için ARCore desteği kontrolü
        setHasARSupport(false); // APK build için false
      }
    } catch (error) {
      console.error('AR desteği kontrol edilirken hata oluştu:', error);
      setHasARSupport(false);
    }
  };

  // Sensör varlığını kontrol etme fonksiyonu (basitleştirilmiş)
  const checkSensorsAvailability = async () => {
    try {
      // APK build için sensör desteği kapatıldı
      setHasSensors(false);
    } catch (error) {
      console.error('Sensör kontrolü sırasında hata oluştu:', error);
      setHasSensors(false);
    }
  };

  // Context değeri
  const value = {
    hasARSupport,
    hasSensors,
    sensorData,
    usePseudoAR: false, // APK build için kapatıldı
  };

  return (
    <DeviceDetectionContext.Provider value={value}>
      {children}
    </DeviceDetectionContext.Provider>
  );
};

// Context hook'u
export const useDeviceDetection = () => {
  const context = useContext(DeviceDetectionContext);
  if (context === undefined) {
    throw new Error('useDeviceDetection hook DeviceDetectionProvider içinde kullanılmalıdır');
  }
  return context;
}; 