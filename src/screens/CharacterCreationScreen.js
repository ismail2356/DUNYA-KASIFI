import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateAvatar, updateEquipment, selectVehicle, createCertificate } from '../store/slices/userSlice';

// Örnek avatar seçenekleri
const genderOptions = ['boy', 'girl'];
const hairStyleOptions = [0, 1, 2, 3];
const hairColorOptions = ['#8B4513', '#000000', '#FFD700', '#A52A2A', '#D3D3D3'];
const skinColorOptions = ['#F5D0A9', '#FFDAB9', '#D2B48C', '#8D5524', '#3B2F2F'];
const eyeColorOptions = ['#8B4513', '#1E90FF', '#006400', '#2F4F4F', '#000000'];
const outfitOptions = [0, 1, 2, 3];

// Örnek ekipman seçenekleri
const binocularsOptions = [0, 1, 2];
const compassOptions = [0, 1, 2];
const notebookOptions = [0, 1, 2];
const cameraOptions = [0, 1, 2];

// Örnek araç seçenekleri
const vehicleOptions = [
  { id: 0, name: 'Sihirli Halı', emoji: '🧞‍♂️' },
  { id: 1, name: 'Küçük Uçak', emoji: '✈️' },
  { id: 2, name: 'Roket', emoji: '🚀' },
  { id: 3, name: 'Sıcak Hava Balonu', emoji: '🎈' },
];

/**
 * Karakter oluşturma ekranı.
 * Kullanıcının avatarını, ekipmanlarını ve aracını seçmesini sağlar.
 */
const CharacterCreationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState('');
  
  // Avatar özellikleri
  const [avatar, setAvatar] = useState({
    gender: 'boy',
    hairStyle: 0,
    hairColor: '#8B4513',
    skinColor: '#F5D0A9',
    eyeColor: '#8B4513',
    outfit: 0,
  });
  
  // Ekipman seçimleri
  const [equipment, setEquipment] = useState({
    binoculars: 0,
    compass: 0,
    notebook: 0,
    camera: 0,
  });
  
  // Seçilen araç
  const [selectedVehicle, setSelectedVehicle] = useState(0);

  // Avatar özelliklerini güncelleme
  const updateAvatarProperty = (property, value) => {
    setAvatar({
      ...avatar,
      [property]: value,
    });
  };

  // Ekipman seçimini güncelleme
  const updateEquipmentProperty = (property, value) => {
    setEquipment({
      ...equipment,
      [property]: value,
    });
  };

  // Bir sonraki adıma geçme
  const goToNextStep = () => {
    if (currentStep === 0 && !username.trim()) {
      Alert.alert('Hata', 'Lütfen bir kullanıcı adı girin.');
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Karakter oluşturma tamamlandı, Redux store'u güncelle
      dispatch(updateAvatar(avatar));
      dispatch(updateEquipment(equipment));
      dispatch(selectVehicle(selectedVehicle));
      dispatch(createCertificate({ name: username, id: `KS-${Math.floor(Math.random() * 10000)}` }));
      
      // Ana ekrana geç
      navigation.replace('Main');
    }
  };

  // Bir önceki adıma dönme
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Adım başlıkları
  const stepTitles = [
    'Kaşif Kimliği',
    'Avatar Oluşturma',
    'Ekipman Seçimi',
    'Araç Seçimi',
  ];

  // Adım içerikleri
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>Kaşif Adı</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Adınızı girin"
              placeholderTextColor="#999999"
              maxLength={20}
            />
            <Text style={styles.description}>
              Bu isim, kaşif sertifikanızda ve profilinizde görünecektir.
            </Text>
          </View>
        );
      case 1:
        return (
          <ScrollView style={styles.stepContent}>
            <Text style={styles.label}>Cinsiyet</Text>
            <View style={styles.optionsRow}>
              {genderOptions.map((gender) => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.optionButton,
                    avatar.gender === gender && styles.selectedOption,
                  ]}
                  onPress={() => updateAvatarProperty('gender', gender)}
                >
                  <Text style={styles.optionText}>
                    {gender === 'boy' ? '👦' : '👧'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Saç Stili</Text>
            <View style={styles.optionsRow}>
              {hairStyleOptions.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.optionButton,
                    avatar.hairStyle === style && styles.selectedOption,
                  ]}
                  onPress={() => updateAvatarProperty('hairStyle', style)}
                >
                  <Text style={styles.optionText}>
                    {style === 0 ? '💇‍♂️' : style === 1 ? '💇‍♀️' : style === 2 ? '👱‍♂️' : '👱‍♀️'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Saç Rengi</Text>
            <View style={styles.optionsRow}>
              {hairColorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    avatar.hairColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => updateAvatarProperty('hairColor', color)}
                />
              ))}
            </View>

            <Text style={styles.label}>Ten Rengi</Text>
            <View style={styles.optionsRow}>
              {skinColorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    avatar.skinColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => updateAvatarProperty('skinColor', color)}
                />
              ))}
            </View>

            <Text style={styles.label}>Göz Rengi</Text>
            <View style={styles.optionsRow}>
              {eyeColorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    avatar.eyeColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => updateAvatarProperty('eyeColor', color)}
                />
              ))}
            </View>

            <Text style={styles.label}>Kıyafet</Text>
            <View style={styles.optionsRow}>
              {outfitOptions.map((outfit) => (
                <TouchableOpacity
                  key={outfit}
                  style={[
                    styles.optionButton,
                    avatar.outfit === outfit && styles.selectedOption,
                  ]}
                  onPress={() => updateAvatarProperty('outfit', outfit)}
                >
                  <Text style={styles.optionText}>
                    {outfit === 0 ? '👕' : outfit === 1 ? '👚' : outfit === 2 ? '🧥' : '👗'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView style={styles.stepContent}>
            <Text style={styles.label}>Dürbün</Text>
            <View style={styles.optionsRow}>
              {binocularsOptions.map((option) => (
                <TouchableOpacity
                  key={`binoculars-${option}`}
                  style={[
                    styles.equipmentOption,
                    equipment.binoculars === option && styles.selectedOption,
                  ]}
                  onPress={() => updateEquipmentProperty('binoculars', option)}
                >
                  <Text style={styles.equipmentEmoji}>🔍</Text>
                  <Text style={styles.equipmentName}>
                    {option === 0 ? 'Standart' : option === 1 ? 'Gelişmiş' : 'Ultra'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Pusula</Text>
            <View style={styles.optionsRow}>
              {compassOptions.map((option) => (
                <TouchableOpacity
                  key={`compass-${option}`}
                  style={[
                    styles.equipmentOption,
                    equipment.compass === option && styles.selectedOption,
                  ]}
                  onPress={() => updateEquipmentProperty('compass', option)}
                >
                  <Text style={styles.equipmentEmoji}>🧭</Text>
                  <Text style={styles.equipmentName}>
                    {option === 0 ? 'Basit' : option === 1 ? 'Dijital' : 'Sihirli'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Not Defteri</Text>
            <View style={styles.optionsRow}>
              {notebookOptions.map((option) => (
                <TouchableOpacity
                  key={`notebook-${option}`}
                  style={[
                    styles.equipmentOption,
                    equipment.notebook === option && styles.selectedOption,
                  ]}
                  onPress={() => updateEquipmentProperty('notebook', option)}
                >
                  <Text style={styles.equipmentEmoji}>📔</Text>
                  <Text style={styles.equipmentName}>
                    {option === 0 ? 'Küçük' : option === 1 ? 'Orta' : 'Büyük'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Fotoğraf Makinesi</Text>
            <View style={styles.optionsRow}>
              {cameraOptions.map((option) => (
                <TouchableOpacity
                  key={`camera-${option}`}
                  style={[
                    styles.equipmentOption,
                    equipment.camera === option && styles.selectedOption,
                  ]}
                  onPress={() => updateEquipmentProperty('camera', option)}
                >
                  <Text style={styles.equipmentEmoji}>📷</Text>
                  <Text style={styles.equipmentName}>
                    {option === 0 ? 'Temel' : option === 1 ? 'Pro' : '360°'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      case 3:
        return (
          <ScrollView style={styles.stepContent}>
            <Text style={styles.description}>
              Maceralarında kullanacağın aracı seç!
            </Text>
            <View style={styles.vehiclesContainer}>
              {vehicleOptions.map((vehicle) => (
                <TouchableOpacity
                  key={`vehicle-${vehicle.id}`}
                  style={[
                    styles.vehicleOption,
                    selectedVehicle === vehicle.id && styles.selectedVehicle,
                  ]}
                  onPress={() => setSelectedVehicle(vehicle.id)}
                >
                  <Text style={styles.vehicleEmoji}>{vehicle.emoji}</Text>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1E88E5" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{stepTitles[currentStep]}</Text>
        <View style={styles.progressContainer}>
          {stepTitles.map((_, index) => (
            <View
              key={`step-${index}`}
              style={[
                styles.progressStep,
                currentStep >= index && styles.activeProgressStep,
              ]}
            />
          ))}
        </View>
      </View>

      {renderStepContent()}

      <View style={styles.footer}>
        {currentStep > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={goToPreviousStep}
          >
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={goToNextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Tamamla' : 'İleri'}
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
  header: {
    backgroundColor: '#1E88E5',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressStep: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 5,
  },
  activeProgressStep: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  optionButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: '#1E88E5',
    borderWidth: 2,
    backgroundColor: '#E3F2FD',
  },
  optionText: {
    fontSize: 24,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  selectedColorOption: {
    borderColor: '#1E88E5',
    borderWidth: 2,
  },
  equipmentOption: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
  },
  equipmentEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  equipmentName: {
    fontSize: 14,
    textAlign: 'center',
  },
  vehiclesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vehicleOption: {
    width: '48%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    marginBottom: 15,
    padding: 10,
  },
  selectedVehicle: {
    borderColor: '#1E88E5',
    borderWidth: 2,
    backgroundColor: '#E3F2FD',
  },
  vehicleEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  backButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CharacterCreationScreen; 