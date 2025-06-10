import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentRoute,
  selectCurrentLocation,
  selectVisitedCountries,
  selectMapView,
  updateMapView,
  zoomMap,
  panMap,
} from '../store/slices/mapSlice';
import { useDeviceDetection } from '../services/DeviceDetectionContext';

const { width, height } = Dimensions.get('window');

// Örnek ülke verileri - Koordinatları düzenlenmiş hali
const countries = [
  { id: 'FR', name: 'Fransa', position: { x: width * 0.4, y: height * 0.3 }, size: 30 },
  { id: 'IT', name: 'İtalya', position: { x: width * 0.45, y: height * 0.32 }, size: 25 },
  { id: 'TR', name: 'Türkiye', position: { x: width * 0.5, y: height * 0.3 }, size: 28 },
  { id: 'UK', name: 'Birleşik Krallık', position: { x: width * 0.38, y: height * 0.27 }, size: 22 },
  { id: 'DE', name: 'Almanya', position: { x: width * 0.42, y: height * 0.28 }, size: 26 },
  { id: 'ES', name: 'İspanya', position: { x: width * 0.35, y: height * 0.32 }, size: 24 },
  { id: 'US', name: 'Amerika Birleşik Devletleri', position: { x: width * 0.2, y: height * 0.3 }, size: 40 },
  { id: 'JP', name: 'Japonya', position: { x: width * 0.7, y: height * 0.3 }, size: 20 },
  { id: 'CN', name: 'Çin', position: { x: width * 0.65, y: height * 0.32 }, size: 35 },
  { id: 'AU', name: 'Avustralya', position: { x: width * 0.7, y: height * 0.45 }, size: 30 },
];

/**
 * Dünya haritası ekranı.
 * Kullanıcının dünya üzerinde gezinmesini ve ülkeleri keşfetmesini sağlar.
 */
const MapScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const currentRoute = useSelector(selectCurrentRoute);
  const currentLocation = useSelector(selectCurrentLocation);
  const visitedCountries = useSelector(selectVisitedCountries);
  const mapView = useSelector(selectMapView);
  const { usePseudoAR } = useDeviceDetection();
  
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryInfo, setShowCountryInfo] = useState(false);
  
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const infoCardOpacity = useRef(new Animated.Value(0)).current;
  
  // Harita arka planı için bazı referans noktaları
  const [mapBackground] = useState({
    gridLines: Array.from({ length: 10 }, (_, i) => ({
      id: `h${i}`,
      x1: 0,
      y1: height * 0.1 + (i * height * 0.08),
      x2: width,
      y2: height * 0.1 + (i * height * 0.08),
    })).concat(
      Array.from({ length: 10 }, (_, i) => ({
        id: `v${i}`,
        x1: width * 0.1 + (i * width * 0.08),
        y1: 0,
        x2: width * 0.1 + (i * width * 0.08),
        y2: height,
      }))
    ),
  });
  
  // Pan Responder ayarları
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        
        // Redux'a harita görünümünü güncelle
        dispatch(panMap({
          lat: mapView.center.lat - pan.y._value / 100,
          lng: mapView.center.lng + pan.x._value / 100,
        }));
      },
    })
  ).current;

  // Ülke seçildiğinde bilgi kartını göster
  useEffect(() => {
    if (selectedCountry) {
      setShowCountryInfo(true);
      Animated.timing(infoCardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(infoCardOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowCountryInfo(false);
      });
    }
  }, [selectedCountry]);

  // Haritayı yakınlaştırma
  const handleZoom = (zoomIn) => {
    const zoomDelta = zoomIn ? 0.5 : -0.5;
    
    Animated.spring(scale, {
      toValue: Math.max(0.5, Math.min(2, scale._value + zoomDelta)),
      friction: 7,
      useNativeDriver: true,
    }).start();
    
    // Redux'a yakınlaştırma değişikliğini bildir
    dispatch(zoomMap(zoomDelta));
  };

  // Haritayı sıfırlama
  const resetMap = () => {
    Animated.parallel([
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Redux'a harita görünümünü sıfırla
    dispatch(updateMapView({
      zoom: 1,
      center: { lat: 0, lng: 0 },
      rotation: 0,
      tilt: 0,
    }));
  };

  // Ülkeye AR deneyimi ile git
  const exploreCountry = (country) => {
    if (usePseudoAR) {
      navigation.navigate('PseudoAR', {
        modelId: country.id,
        modelName: country.name,
      });
    } else {
      navigation.navigate('ARExperience', {
        modelId: country.id,
        modelName: country.name,
      });
    }
  };

  // Ülke seçimi
  const selectCountry = (country) => {
    setSelectedCountry(country);
  };

  // Ülke ziyaret edilmiş mi kontrolü
  const isVisited = (countryId) => {
    return visitedCountries.some(country => country.id === countryId);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
      
      {/* Harita başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dünya Haritası</Text>
        {currentRoute && (
          <Text style={styles.routeText}>
            Mevcut Rota: {currentRoute.startPoint} → {currentRoute.endPoint}
          </Text>
        )}
      </View>
      
      {/* Harita içeriği */}
      <View style={styles.mapContainer}>
        {/* Harita arka planı - Grid çizgileri */}
        <View style={styles.mapBackgroundGrid}>
          {mapBackground.gridLines.map(line => (
            <View
              key={line.id}
              style={[
                styles.gridLine,
                {
                  position: 'absolute',
                  left: line.x1,
                  top: line.y1,
                  width: line.id.startsWith('v') ? 1 : line.x2 - line.x1,
                  height: line.id.startsWith('h') ? 1 : line.y2 - line.y1,
                }
              ]}
            />
          ))}
        </View>
        
        <Animated.View
          style={[
            styles.map,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { scale: scale },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Ülkeler */}
          {countries.map((country) => (
            <TouchableOpacity
              key={country.id}
              style={[
                styles.country,
                {
                  left: country.position.x,
                  top: country.position.y,
                  width: country.size,
                  height: country.size,
                  backgroundColor: isVisited(country.id) ? '#4CAF50' : '#1E88E5',
                },
              ]}
              onPress={() => selectCountry(country)}
            />
          ))}
          
          {/* Mevcut konum göstergesi */}
          {currentLocation && (
            <View
              style={[
                styles.currentLocation,
                {
                  left: width * 0.5,
                  top: height * 0.3,
                },
              ]}
            />
          )}
        </Animated.View>
      </View>
      
      {/* Zoom kontrolleri */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => handleZoom(true)}
        >
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => handleZoom(false)}
        >
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>
      
      {/* Sıfırlama butonu */}
      <TouchableOpacity
        style={styles.resetButton}
        onPress={resetMap}
      >
        <Text style={styles.resetButtonText}>Haritayı Sıfırla</Text>
      </TouchableOpacity>
      
      {/* Ülke bilgi kartı */}
      {showCountryInfo && (
        <Animated.View
          style={[
            styles.countryInfo,
            { opacity: infoCardOpacity },
          ]}
        >
          <View style={styles.countryInfoHeader}>
            <Text style={styles.countryName}>{selectedCountry?.name}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedCountry(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.countryInfoContent}>
            <Text style={styles.countryStatusText}>
              {isVisited(selectedCountry?.id)
                ? '✓ Bu ülkeyi ziyaret ettin!'
                : '⚠ Henüz ziyaret edilmedi'}
            </Text>
            
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => exploreCountry(selectedCountry)}
            >
              <Text style={styles.exploreButtonText}>3D Keşfet</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E88E5',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  routeText: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 5,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackgroundGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    backgroundColor: 'rgba(200, 200, 200, 0.2)',
  },
  map: {
    flex: 1,
    position: 'relative',
  },
  country: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  currentLocation: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F44336',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  zoomControls: {
    position: 'absolute',
    right: 20,
    top: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 5,
  },
  zoomButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    marginVertical: 5,
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  resetButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  countryInfo: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    elevation: 4,
  },
  countryInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666666',
  },
  countryInfoContent: {
    alignItems: 'center',
  },
  countryStatusText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  exploreButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default MapScreen; 