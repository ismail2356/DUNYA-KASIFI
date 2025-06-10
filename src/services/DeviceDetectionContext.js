import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as ExpoSensors from 'expo-sensors';

// Sensör güncelleme aralığı (ms)
const SENSOR_UPDATE_INTERVAL = 100;

// Context oluşturma
const DeviceDetectionContext = createContext();

/**
 * Cihaz algılama ve sensör verilerini sağlayan provider bileşeni.
 * AR desteği kontrolü ve sensör verilerine erişim için kullanılır.
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

  // Sensör verilerini alma
  useEffect(() => {
    if (hasSensors) {
      // Sensör güncelleme aralığını ayarla
      ExpoSensors.Gyroscope.setUpdateInterval(SENSOR_UPDATE_INTERVAL);
      ExpoSensors.Accelerometer.setUpdateInterval(SENSOR_UPDATE_INTERVAL);

      // Jiroskop sensör dinleyicisini ayarla
      let gyroSubscription = null;
      
      ExpoSensors.Gyroscope.isAvailableAsync().then(available => {
        if (available) {
          gyroSubscription = ExpoSensors.Gyroscope.addListener(gyroData => {
            setSensorData(prev => ({
              ...prev,
              gyroscope: gyroData
            }));
          });
        }
      });

      // İvmeölçer sensör dinleyicisini ayarla
      let accelSubscription = null;
      
      ExpoSensors.Accelerometer.isAvailableAsync().then(available => {
        if (available) {
          accelSubscription = ExpoSensors.Accelerometer.addListener(accelData => {
            setSensorData(prev => ({
              ...prev,
              accelerometer: accelData
            }));
          });
        }
      });

      // Temizleme fonksiyonu
      return () => {
        if (gyroSubscription) {
          gyroSubscription.remove();
        }
        if (accelSubscription) {
          accelSubscription.remove();
        }
      };
    }
  }, [hasSensors]);

  // AR desteğini kontrol etme fonksiyonu
  const checkARSupport = async () => {
    // Gerçek uygulamada ARKit veya ARCore desteği kontrol edilecek
    // Şimdilik basit bir kontrol yapıyoruz
    try {
      // Platform'a göre AR desteği kontrolü
      if (Platform.OS === 'ios') {
        // iOS için ARKit desteği kontrolü
        setHasARSupport(false); // Örnek olarak false ayarlandı
      } else if (Platform.OS === 'android') {
        // Android için ARCore desteği kontrolü
        setHasARSupport(false); // Örnek olarak false ayarlandı
      }
    } catch (error) {
      console.error('AR desteği kontrol edilirken hata oluştu:', error);
      setHasARSupport(false);
    }
  };

  // Sensör varlığını kontrol etme fonksiyonu
  const checkSensorsAvailability = async () => {
    try {
      // Expo ile sensör varlığını kontrol et
      const isGyroAvailable = await ExpoSensors.Gyroscope.isAvailableAsync();
      const isAccelAvailable = await ExpoSensors.Accelerometer.isAvailableAsync();
      
      setHasSensors(isGyroAvailable && isAccelAvailable);
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
    usePseudoAR: !hasARSupport && hasSensors, // AR desteği yoksa ve sensörler varsa pseudo-AR kullan
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