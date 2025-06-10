import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

/**
 * AR deneyimi ekranı.
 * AR destekleyen cihazlarda gerçek AR deneyimi sağlar.
 * Not: Bu ekran şu anda bir yer tutucu olarak kullanılmaktadır.
 * Gerçek uygulamada ARKit veya ARCore entegrasyonu burada yapılacaktır.
 */
const ARExperienceScreen = ({ route, navigation }) => {
  // Route parametrelerinden model bilgilerini al
  const modelId = route.params?.modelId || 'default';
  const modelName = route.params?.modelName || 'AR Deneyimi';

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{modelName}</Text>
        <Text style={styles.infoText}>
          Bu cihaz AR deneyimini destekliyor. Ancak AR deneyimi şu anda geliştirme aşamasındadır.
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ARExperienceScreen; 