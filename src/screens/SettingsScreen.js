import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectGeneralSettings,
  selectAccessibilitySettings,
  selectEyeHealthSettings,
  selectParentalControls,
  selectPerformanceSettings,
  updateGeneralSettings,
  updateAccessibilitySettings,
  updateEyeHealthSettings,
  updateParentalControls,
  updatePerformanceSettings,
  changeLanguage,
  changeTheme,
  toggleSound,
  toggleMusic,
  resetSettings,
} from '../store/slices/settingsSlice';

/**
 * Ayarlar ekranı.
 * Kullanıcının uygulama ayarlarını yapılandırmasını sağlar.
 */
const SettingsScreen = () => {
  const dispatch = useDispatch();
  const generalSettings = useSelector(selectGeneralSettings);
  const accessibilitySettings = useSelector(selectAccessibilitySettings);
  const eyeHealthSettings = useSelector(selectEyeHealthSettings);
  const parentalControls = useSelector(selectParentalControls);
  const performanceSettings = useSelector(selectPerformanceSettings);
  
  const [showParentalPassword, setShowParentalPassword] = useState(false);
  const [parentalPassword, setParentalPassword] = useState('');
  
  // Dil seçenekleri
  const languages = [
    { id: 'tr', name: 'Türkçe' },
    { id: 'en', name: 'İngilizce' },
    { id: 'fr', name: 'Fransızca' },
    { id: 'de', name: 'Almanca' },
    { id: 'es', name: 'İspanyolca' },
  ];
  
  // Tema seçenekleri
  const themes = [
    { id: 'light', name: 'Açık' },
    { id: 'dark', name: 'Koyu' },
    { id: 'auto', name: 'Otomatik' },
  ];
  
  // Yazı tipi boyutu seçenekleri
  const fontSizes = [
    { id: 'small', name: 'Küçük' },
    { id: 'medium', name: 'Orta' },
    { id: 'large', name: 'Büyük' },
    { id: 'xlarge', name: 'Çok Büyük' },
  ];
  
  // Grafik kalitesi seçenekleri
  const graphicsQualities = [
    { id: 'low', name: 'Düşük' },
    { id: 'medium', name: 'Orta' },
    { id: 'high', name: 'Yüksek' },
  ];
  
  // İçerik filtresi seçenekleri
  const contentFilters = [
    { id: 'low', name: 'Düşük' },
    { id: 'moderate', name: 'Orta' },
    { id: 'high', name: 'Yüksek' },
  ];
  
  // Ayarları sıfırlama
  const handleResetSettings = () => {
    Alert.alert(
      'Ayarları Sıfırla',
      'Tüm ayarlar varsayılan değerlerine sıfırlanacak. Devam etmek istiyor musunuz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sıfırla',
          onPress: () => dispatch(resetSettings()),
          style: 'destructive',
        },
      ]
    );
  };
  
  // Ebeveyn kontrolleri şifre değişikliği
  const handleParentalPasswordChange = () => {
    // Gerçek uygulamada burada şifre değiştirme modalı açılacak
    setShowParentalPassword(!showParentalPassword);
  };
  
  // Seçenek öğesi render fonksiyonu
  const renderOptionItem = ({ id, name, selectedId, onSelect }) => {
    return (
      <TouchableOpacity
        key={id}
        style={[
          styles.optionItem,
          id === selectedId && styles.selectedOptionItem,
        ]}
        onPress={() => onSelect(id)}
      >
        <Text
          style={[
            styles.optionText,
            id === selectedId && styles.selectedOptionText,
          ]}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
      
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Genel ayarlar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel Ayarlar</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dil</Text>
            <View style={styles.optionsContainer}>
              {languages.map((language) => 
                renderOptionItem({
                  ...language,
                  selectedId: generalSettings.language,
                  onSelect: (id) => dispatch(changeLanguage(id)),
                })
              )}
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Tema</Text>
            <View style={styles.optionsContainer}>
              {themes.map((theme) => 
                renderOptionItem({
                  ...theme,
                  selectedId: generalSettings.theme,
                  onSelect: (id) => dispatch(changeTheme(id)),
                })
              )}
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Ses Efektleri</Text>
            <Switch
              value={generalSettings.soundEnabled}
              onValueChange={() => dispatch(toggleSound())}
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={generalSettings.soundEnabled ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Müzik</Text>
            <Switch
              value={generalSettings.musicEnabled}
              onValueChange={() => dispatch(toggleMusic())}
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={generalSettings.musicEnabled ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Müzik Ses Seviyesi</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={generalSettings.musicVolume}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                minimumTrackTintColor="#1E88E5"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#1E88E5"
                onSlidingComplete={(value) => 
                  dispatch(updateGeneralSettings({ musicVolume: value }))
                }
                disabled={!generalSettings.musicEnabled}
              />
              <Text style={styles.sliderValue}>
                {Math.round(generalSettings.musicVolume * 100)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Ses Efektleri Seviyesi</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={generalSettings.soundVolume}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                minimumTrackTintColor="#1E88E5"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#1E88E5"
                onSlidingComplete={(value) => 
                  dispatch(updateGeneralSettings({ soundVolume: value }))
                }
                disabled={!generalSettings.soundEnabled}
              />
              <Text style={styles.sliderValue}>
                {Math.round(generalSettings.soundVolume * 100)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Titreşim</Text>
            <Switch
              value={generalSettings.vibrationEnabled}
              onValueChange={(value) => 
                dispatch(updateGeneralSettings({ vibrationEnabled: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={generalSettings.vibrationEnabled ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Bildirimler</Text>
            <Switch
              value={generalSettings.notificationsEnabled}
              onValueChange={(value) => 
                dispatch(updateGeneralSettings({ notificationsEnabled: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={generalSettings.notificationsEnabled ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
        </View>
        
        {/* Erişilebilirlik ayarları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Erişilebilirlik</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Yazı Tipi Boyutu</Text>
            <View style={styles.optionsContainer}>
              {fontSizes.map((fontSize) => 
                renderOptionItem({
                  ...fontSize,
                  selectedId: accessibilitySettings.fontSize,
                  onSelect: (id) => 
                    dispatch(updateAccessibilitySettings({ fontSize: id })),
                })
              )}
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Yüksek Kontrast</Text>
            <Switch
              value={accessibilitySettings.highContrast}
              onValueChange={(value) => 
                dispatch(updateAccessibilitySettings({ highContrast: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={accessibilitySettings.highContrast ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Hareketi Azalt</Text>
            <Switch
              value={accessibilitySettings.reduceMotion}
              onValueChange={(value) => 
                dispatch(updateAccessibilitySettings({ reduceMotion: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={accessibilitySettings.reduceMotion ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Ekran Okuyucu İpuçları</Text>
            <Switch
              value={accessibilitySettings.screenReaderHints}
              onValueChange={(value) => 
                dispatch(updateAccessibilitySettings({ screenReaderHints: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={accessibilitySettings.screenReaderHints ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
        </View>
        
        {/* Göz sağlığı ayarları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Göz Sağlığı</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Göz Dinlendirme Hatırlatıcıları</Text>
            <Switch
              value={eyeHealthSettings.remindersEnabled}
              onValueChange={(value) => 
                dispatch(updateEyeHealthSettings({ remindersEnabled: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={eyeHealthSettings.remindersEnabled ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Hatırlatma Aralığı (dk)</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={eyeHealthSettings.reminderInterval}
                minimumValue={10}
                maximumValue={60}
                step={5}
                minimumTrackTintColor="#1E88E5"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#1E88E5"
                onSlidingComplete={(value) => 
                  dispatch(updateEyeHealthSettings({ reminderInterval: value }))
                }
                disabled={!eyeHealthSettings.remindersEnabled}
              />
              <Text style={styles.sliderValue}>
                {eyeHealthSettings.reminderInterval} dk
              </Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Mavi Işık Filtresi</Text>
            <Switch
              value={eyeHealthSettings.blueFilterEnabled}
              onValueChange={(value) => 
                dispatch(updateEyeHealthSettings({ blueFilterEnabled: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={eyeHealthSettings.blueFilterEnabled ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Filtre Yoğunluğu</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={eyeHealthSettings.blueFilterIntensity}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                minimumTrackTintColor="#1E88E5"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#1E88E5"
                onSlidingComplete={(value) => 
                  dispatch(updateEyeHealthSettings({ blueFilterIntensity: value }))
                }
                disabled={!eyeHealthSettings.blueFilterEnabled}
              />
              <Text style={styles.sliderValue}>
                {Math.round(eyeHealthSettings.blueFilterIntensity * 100)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Otomatik Parlaklık</Text>
            <Switch
              value={eyeHealthSettings.autoBrightness}
              onValueChange={(value) => 
                dispatch(updateEyeHealthSettings({ autoBrightness: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={eyeHealthSettings.autoBrightness ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
        </View>
        
        {/* Ebeveyn kontrolleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ebeveyn Kontrolleri</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Ebeveyn Kontrolleri Etkin</Text>
            <Switch
              value={parentalControls.enabled}
              onValueChange={(value) => 
                dispatch(updateParentalControls({ enabled: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={parentalControls.enabled ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Günlük Kullanım Süresi (dk)</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                value={parentalControls.timeLimit}
                minimumValue={15}
                maximumValue={120}
                step={15}
                minimumTrackTintColor="#1E88E5"
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor="#1E88E5"
                onSlidingComplete={(value) => 
                  dispatch(updateParentalControls({ timeLimit: value }))
                }
                disabled={!parentalControls.enabled}
              />
              <Text style={styles.sliderValue}>
                {parentalControls.timeLimit} dk
              </Text>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>İçerik Filtresi</Text>
            <View style={styles.optionsContainer}>
              {contentFilters.map((filter) => 
                renderOptionItem({
                  ...filter,
                  selectedId: parentalControls.contentFilter,
                  onSelect: (id) => 
                    dispatch(updateParentalControls({ contentFilter: id })),
                })
              )}
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Şifre Korumalı Ayarlar</Text>
            <Switch
              value={parentalControls.passwordProtected}
              onValueChange={(value) => 
                dispatch(updateParentalControls({ passwordProtected: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={parentalControls.passwordProtected ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <TouchableOpacity
            style={[
              styles.button,
              !parentalControls.passwordProtected && styles.disabledButton,
            ]}
            onPress={handleParentalPasswordChange}
            disabled={!parentalControls.passwordProtected}
          >
            <Text style={styles.buttonText}>Ebeveyn Şifresini Değiştir</Text>
          </TouchableOpacity>
        </View>
        
        {/* Performans ayarları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performans</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Grafik Kalitesi</Text>
            <View style={styles.optionsContainer}>
              {graphicsQualities.map((quality) => 
                renderOptionItem({
                  ...quality,
                  selectedId: performanceSettings.graphicsQuality,
                  onSelect: (id) => 
                    dispatch(updatePerformanceSettings({ graphicsQuality: id })),
                })
              )}
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Yükleme Optimizasyonu</Text>
            <Switch
              value={performanceSettings.loadingOptimization}
              onValueChange={(value) => 
                dispatch(updatePerformanceSettings({ loadingOptimization: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={performanceSettings.loadingOptimization ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Pil Optimizasyonu</Text>
            <Switch
              value={performanceSettings.batteryOptimization}
              onValueChange={(value) => 
                dispatch(updatePerformanceSettings({ batteryOptimization: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={performanceSettings.batteryOptimization ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Veri Kullanımı Optimizasyonu</Text>
            <Switch
              value={performanceSettings.dataUsageOptimization}
              onValueChange={(value) => 
                dispatch(updatePerformanceSettings({ dataUsageOptimization: value }))
              }
              trackColor={{ false: '#E0E0E0', true: '#90CAF9' }}
              thumbColor={performanceSettings.dataUsageOptimization ? '#1E88E5' : '#F5F5F5'}
            />
          </View>
        </View>
        
        {/* Ayarları sıfırlama */}
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleResetSettings}
        >
          <Text style={[styles.buttonText, styles.resetButtonText]}>
            Tüm Ayarları Sıfırla
          </Text>
        </TouchableOpacity>
        
        {/* Versiyon bilgisi */}
        <Text style={styles.versionText}>Sürüm 1.0.0</Text>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  selectedOptionItem: {
    backgroundColor: '#E3F2FD',
  },
  optionText: {
    fontSize: 14,
    color: '#666666',
  },
  selectedOptionText: {
    color: '#1E88E5',
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  slider: {
    flex: 1,
  },
  sliderValue: {
    width: 40,
    fontSize: 14,
    color: '#666666',
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  resetButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#FF5722',
    marginTop: 20,
  },
  resetButtonText: {
    color: '#FF5722',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
    marginVertical: 20,
  },
});

export default SettingsScreen;