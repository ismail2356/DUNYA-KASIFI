import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import EiffelTowerGLTF from '../components/EiffelTowerGLTF';

// Örnek ülke landmark verileri
const countryLandmarks = {
  'FR': { 
    name: 'Eyfel Kulesi',
    color: '#3498db',
    description: 'Paris\'in sembolü olan Eyfel Kulesi, Fransa\'nın en ünlü yapısıdır.'
  },
  'IT': { 
    name: 'Kolezyum',
    color: '#e74c3c',
    description: 'Roma\'daki Kolezyum, antik dünyanın en büyük amfitiyatrolarından biridir.'
  },
  'TR': { 
    name: 'Ayasofya',
    color: '#e67e22',
    description: 'İstanbul\'da bulunan Ayasofya, dünya mimarlık tarihinin en önemli anıtlarından biridir.'
  },
  'UK': { 
    name: 'Big Ben',
    color: '#2ecc71',
    description: 'Londra\'daki Big Ben, İngiltere\'nin en tanınan sembollerinden biridir.'
  },
  'DE': { 
    name: 'Brandenburg Kapısı',
    color: '#f1c40f',
    description: 'Berlin\'deki Brandenburg Kapısı, Almanya\'nın birliğini simgeler.'
  },
  'ES': { 
    name: 'Sagrada Familia',
    color: '#9b59b6',
    description: 'Barcelona\'daki Sagrada Familia, Antoni Gaudi\'nin en ünlü eseridir.'
  },
  'US': { 
    name: 'Özgürlük Heykeli',
    color: '#1abc9c',
    description: 'New York\'taki Özgürlük Heykeli, Amerika\'nın en tanınan sembolüdür.'
  },
  'JP': { 
    name: 'Fuji Dağı',
    color: '#34495e',
    description: 'Japonya\'nın en yüksek dağı olan Fuji Dağı, ülkenin kutsal sembollerinden biridir.'
  },
  'CN': { 
    name: 'Çin Seddi',
    color: '#d35400',
    description: 'Çin Seddi, dünyanın en uzun insan yapımı yapısıdır.'
  },
  'AU': { 
    name: 'Sidney Opera Binası',
    color: '#16a085',
    description: 'Sidney Opera Binası, Avustralya\'nın en tanınan yapılarından biridir.'
  },
  'default': { 
    name: 'Dünya Harikası',
    color: '#8e44ad',
    description: 'Bu muhteşem yapı hakkında daha fazla bilgi edinmek için keşfet!'
  }
};

/**
 * Basit 3D model görüntüleyici ekranı.
 * Kamera ve sensör olmadan sadece 3D modeli gösterir.
 */
const PseudoARScreen = ({ route, navigation }) => {
  const [showInfo, setShowInfo] = useState(false);

  // Ülke verilerini al
  const modelId = route.params?.modelId || 'default';
  const modelName = route.params?.modelName || 'Bilinmeyen Ülke';
  
  // Landmark bilgilerini al
  const landmark = useMemo(() => {
    return countryLandmarks[modelId] || countryLandmarks.default;
  }, [modelId]);

  // Bilgi kartını göster/gizle
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Gradient arka plan */}
      <View style={[styles.background, { backgroundColor: landmark.color }]} />
      
      {/* Model görüntüleyici alanı */}
      <View style={styles.modelContainer}>
        {modelId === 'FR' ? (
          // Eyfel Kulesi için 3D model
          <View style={styles.eiffelContainer}>
            <EiffelTowerGLTF
              rotationX={0}
              rotationY={0}
            />
          </View>
        ) : (
          // Diğer landmark'lar için basit görünüm
          <View
            style={[
              styles.landmarkContainer,
              { backgroundColor: landmark.color }
            ]}
          >
            <View style={styles.landmarkNameContainer}>
              <Text style={styles.landmarkName}>{landmark.name}</Text>
            </View>
          </View>
        )}
      </View>
      
      {/* Bilgi kartı */}
      {showInfo && (
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{landmark.name}</Text>
          <Text style={styles.infoText}>{landmark.description}</Text>
          <Text style={styles.locationText}>
            Konum: {modelName}
          </Text>
          <TouchableOpacity 
            style={styles.closeInfoButton}
            onPress={toggleInfo}
          >
            <Text style={styles.closeInfoButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Üst bilgi çubuğu */}
      <View style={styles.topBar}>
        <Text style={styles.countryName}>
          {modelName} - {landmark.name}
        </Text>
        <TouchableOpacity style={styles.infoButton} onPress={toggleInfo}>
          <Text style={styles.infoButtonText}>ℹ️</Text>
        </TouchableOpacity>
      </View>
      
      {/* Kontrol butonları */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>← Geri</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, styles.infoControlButton]} onPress={toggleInfo}>
          <Text style={styles.buttonText}>📖 Bilgi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    zIndex: 1000,
  },
  countryName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  infoButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 16,
  },
  modelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
  },
  eiffelContainer: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  landmarkContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  landmarkNameContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  landmarkName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoCard: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 15,
    padding: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  locationText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  closeInfoButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  closeInfoButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoControlButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PseudoARScreen; 