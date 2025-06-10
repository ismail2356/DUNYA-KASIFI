import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchQuestsStart, fetchQuestsSuccess } from '../store/slices/questsSlice';

// Örnek görevler - gerçek uygulamada API'dan gelecek
const sampleQuests = [
  {
    id: 'q1',
    title: 'Paris Keşfi',
    description: 'Paris\'in ünlü yapılarını keşfet ve bilgilerini topla.',
    categoryId: 'geography',
    xpReward: 100,
    progress: 0,
  },
  {
    id: 'q2',
    title: 'Fransızca Selamlaşma',
    description: 'Fransızca temel selamlaşma ifadelerini öğren.',
    categoryId: 'language',
    xpReward: 50,
    progress: 0,
  },
  {
    id: 'q3',
    title: 'Uçuş Yüksekliği Hesaplama',
    description: 'Uçağın yüksekliğini ve hızını kullanarak mesafe hesapla.',
    categoryId: 'minigames',
    xpReward: 75,
    progress: 0,
  },
];

const { width, height } = Dimensions.get('window');

/**
 * Uygulama açılış ekranı.
 * Logo animasyonu ve veri yükleme işlemleri burada gerçekleşir.
 */
const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const logoScale = new Animated.Value(0.3);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    // Logo animasyonu
    Animated.sequence([
      // Logo görünür hale gelir
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Logo büyür
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Metin görünür hale gelir
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Verileri yükle
    loadInitialData();

    // 3 saniye sonra ana ekrana geç
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Başlangıç verilerini yükle
  const loadInitialData = async () => {
    try {
      dispatch(fetchQuestsStart());
      
      // Gerçek uygulamada burada API çağrısı yapılacak
      // Şimdilik örnek veriler kullanıyoruz
      setTimeout(() => {
        dispatch(fetchQuestsSuccess(sampleQuests));
      }, 1000);
      
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        {/* Logo yerine geçici bir daire kullanıyoruz */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>DK</Text>
        </View>
      </Animated.View>

      <Animated.Text
        style={[
          styles.title,
          {
            opacity: textOpacity,
          },
        ]}
      >
        Dünya Kaşifi
      </Animated.Text>
      
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: textOpacity,
          },
        ]}
      >
        Keşfetmeye Hazır Ol!
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  title: {
    marginTop: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#E3F2FD',
  },
});

export default SplashScreen; 