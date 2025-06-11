import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Onboarding sayfaları
const onboardingData = [
  {
    id: '1',
    title: 'Dünyayı Keşfet',
    description: 'Uçuş sırasında dünyanın farklı bölgelerini keşfet ve yeni bilgiler öğren.',
    backgroundColor: '#1E88E5',
    image: '🌍',
  },
  {
    id: '2',
    title: 'Kültürleri Öğren',
    description: 'Farklı ülkelerin kültürlerini, yemeklerini ve geleneklerini öğren.',
    backgroundColor: '#43A047',
    image: '🏛️',
  },
  {
    id: '3',
    title: 'Dilleri Tanı',
    description: 'Gittiğin ülkelerin dillerinden temel ifadeleri öğren ve pratik yap.',
    backgroundColor: '#FF9800',
    image: '🗣️',
  },
  {
    id: '4',
    title: 'Eğlenerek Öğren',
    description: 'Mini oyunlar ve görevlerle eğlenerek yeni bilgiler kazan.',
    backgroundColor: '#7B1FA2',
    image: '🎮',
  },
];

/**
 * Uygulama tanıtım ekranı.
 * Uygulamanın temel özelliklerini tanıtan bir kaydırmalı ekran.
 */
const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Bir sonraki sayfaya geçme
  const goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Son sayfadaysa karakter oluşturma ekranına git
      navigation.replace('CharacterCreation');
    }
  };

  // Onboarding'i atla ve doğrudan karakter oluşturma ekranına git
  const skip = () => {
    navigation.replace('CharacterCreation');
  };

  // Sayfa göstergesi noktaları
  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, width);

    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => {
          const opacity = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const dotWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  opacity,
                  width: dotWidth,
                  backgroundColor: 'white',
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Onboarding sayfası öğesi
  const renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.backgroundColor,
            width,
          },
        ]}
      >
        <Text style={styles.image}>{item.image}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
      />

      {renderDots()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={skip}>
          <Text style={styles.skipButtonText}>Atla</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={goToNextSlide}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? 'Başla' : 'İleri'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  image: {
    fontSize: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#F5F5F5',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  skipButton: {
    padding: 15,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen; 