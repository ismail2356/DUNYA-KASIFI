import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import { helpers } from '../utils';
import { SvgXml } from 'react-native-svg';

// Bayrak SVG dosyalarını içe aktarıyoruz
import TRFlag from '../assets/flags/tr.svg';
import FRFlag from '../assets/flags/fr.svg';
import ITFlag from '../assets/flags/it.svg';
import DEFlag from '../assets/flags/de.svg';
import GBFlag from '../assets/flags/gb.svg';
import ESFlag from '../assets/flags/es.svg';
import USFlag from '../assets/flags/us.svg';
import CAFlag from '../assets/flags/ca.svg';
import BRFlag from '../assets/flags/br.svg';
import ARFlag from '../assets/flags/ar.svg';
import CNFlag from '../assets/flags/cn.svg';
import JPFlag from '../assets/flags/jp.svg';
import INFlag from '../assets/flags/in.svg';
import AUFlag from '../assets/flags/au.svg';
import ZAFlag from '../assets/flags/za.svg';
import EGFlag from '../assets/flags/eg.svg';

// Simüle edilmiş ülke verileri (gerçek uygulamada API'den alınacak)
const COUNTRIES = [
  { id: 'TR', name: 'Türkiye', continent: 'Avrupa/Asya', flagComponent: TRFlag },
  { id: 'FR', name: 'Fransa', continent: 'Avrupa', flagComponent: FRFlag },
  { id: 'IT', name: 'İtalya', continent: 'Avrupa', flagComponent: ITFlag },
  { id: 'DE', name: 'Almanya', continent: 'Avrupa', flagComponent: DEFlag },
  { id: 'GB', name: 'Birleşik Krallık', continent: 'Avrupa', flagComponent: GBFlag },
  { id: 'ES', name: 'İspanya', continent: 'Avrupa', flagComponent: ESFlag },
  { id: 'US', name: 'Amerika Birleşik Devletleri', continent: 'Kuzey Amerika', flagComponent: USFlag },
  { id: 'CA', name: 'Kanada', continent: 'Kuzey Amerika', flagComponent: CAFlag },
  { id: 'BR', name: 'Brezilya', continent: 'Güney Amerika', flagComponent: BRFlag },
  { id: 'AR', name: 'Arjantin', continent: 'Güney Amerika', flagComponent: ARFlag },
  { id: 'CN', name: 'Çin', continent: 'Asya', flagComponent: CNFlag },
  { id: 'JP', name: 'Japonya', continent: 'Asya', flagComponent: JPFlag },
  { id: 'IN', name: 'Hindistan', continent: 'Asya', flagComponent: INFlag },
  { id: 'AU', name: 'Avustralya', continent: 'Okyanusya', flagComponent: AUFlag },
  { id: 'ZA', name: 'Güney Afrika', continent: 'Afrika', flagComponent: ZAFlag },
  { id: 'EG', name: 'Mısır', continent: 'Afrika', flagComponent: EGFlag },
];

/**
 * Ülke Bulma Oyunu bileşeni.
 * Çocukların ülkeleri bayraklarından ve ipuçlarından tanımasını sağlayan eğitici bir oyun.
 */
const CountryFinder = ({ onComplete, onFail, setScore, score }) => {
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(5); // Toplam 5 soru
  const [correctCountry, setCorrectCountry] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [clueShown, setClueShown] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  
  // Oyun seviyesini takip et
  const [level, setLevel] = useState(1);
  
  // Oyunu başlat veya sonraki soruya geç
  const startNextRound = () => {
    // Karıştırılmış ülke listesi oluştur
    const shuffledCountries = helpers.shuffleArray(COUNTRIES);
    
    // Doğru cevabı belirle
    const correct = shuffledCountries[0];
    setCorrectCountry(correct);
    
    // Seçenekleri oluştur (1 doğru, 3 yanlış)
    let roundOptions = [correct];
    
    // Level 1: Farklı kıtalardan ülkeler (kolay)
    // Level 2: Benzer kıtalardan ülkeler (orta)
    // Level 3: Aynı kıtadan ülkeler (zor)
    let filteredCountries;
    
    if (level === 1) {
      // Farklı kıtalardan rastgele ülkeler
      filteredCountries = shuffledCountries.filter(c => c.id !== correct.id);
    } else if (level === 2) {
      // Benzer kıtalardan ülkeler (bazıları aynı kıtadan, bazıları farklı)
      const sameContinent = shuffledCountries.filter(c => 
        c.id !== correct.id && c.continent === correct.continent);
      const differentContinent = shuffledCountries.filter(c => 
        c.id !== correct.id && c.continent !== correct.continent);
      
      filteredCountries = [...helpers.shuffleArray(sameContinent).slice(0, 1), 
                           ...helpers.shuffleArray(differentContinent)];
    } else {
      // Aynı kıtadan ülkeler (daha zor)
      filteredCountries = shuffledCountries.filter(c => 
        c.id !== correct.id && c.continent === correct.continent);
      
      // Eğer yeterli ülke yoksa diğer kıtalardan ekle
      if (filteredCountries.length < 3) {
        const otherCountries = shuffledCountries.filter(c => 
          c.id !== correct.id && c.continent !== correct.continent);
        filteredCountries = [...filteredCountries, ...otherCountries];
      }
    }
    
    // 3 yanlış seçenek ekle
    roundOptions = [...roundOptions, ...filteredCountries.slice(0, 3)];
    
    // Seçenekleri karıştır
    setOptions(helpers.shuffleArray(roundOptions));
    
    // Durumu sıfırla
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
    setClueShown(false);
    setRoundScore(0);
  };
  
  // İlk yükleme ve seviye değişiminde oyunu başlat
  useEffect(() => {
    startNextRound();
  }, [level]);
  
  // Sonraki seviyeye geç
  const nextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
    }
    setRound(1);
  };
  
  // Cevap seçildiğinde
  const selectOption = (option) => {
    if (selectedOption !== null) return; // Zaten bir seçenek seçilmişse çıkış yap
    
    setSelectedOption(option);
    const correct = option.id === correctCountry.id;
    setIsCorrect(correct);
    
    // Puan hesaplama
    let points = 0;
    if (correct) {
      // Temel puan
      points = 10;
      
      // Seviye bonusu
      points += (level - 1) * 5;
      
      // İpucu kullanılmadıysa bonus
      if (!clueShown) {
        points += 5;
      }
      
      setRoundScore(points);
      setScore((prevScore) => prevScore + points);
    }
    
    // 1 saniye sonra cevabı göster
    setTimeout(() => {
      setShowAnswer(true);
      
      // 2 saniye sonra sonraki soru veya oyun sonu
      setTimeout(() => {
        if (round < maxRounds) {
          setRound(round + 1);
          startNextRound();
        } else {
          // Son turdan sonra seviye kontrolü
          if (level < 3) {
            nextLevel();
          } else {
            // Oyun tamamlandı
            onComplete();
          }
        }
      }, 2000);
    }, 1000);
  };
  
  // İpucu göster
  const showClue = () => {
    setClueShown(true);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roundText}>Tur: {round}/{maxRounds}</Text>
        <Text style={styles.levelText}>Seviye: {level}/3</Text>
      </View>
      
      <View style={styles.flagContainer}>
        {correctCountry?.flagComponent && (
          <View style={styles.flagWrapper}>
            <correctCountry.flagComponent width={width * 0.7} height={width * 0.4} style={styles.flagImage} />
          </View>
        )}
      </View>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Bu hangi ülkenin bayrağı?</Text>
        
        {clueShown && (
          <Text style={styles.clueText}>İpucu: {correctCountry?.continent} kıtasında</Text>
        )}
      </View>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption === option && (isCorrect ? styles.correctOption : styles.wrongOption),
              showAnswer && option.id === correctCountry.id && styles.correctOption,
            ]}
            onPress={() => selectOption(option)}
            disabled={selectedOption !== null}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && (isCorrect ? styles.correctOptionText : styles.wrongOptionText),
                showAnswer && option.id === correctCountry.id && styles.correctOptionText,
              ]}
            >
              {option.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {!clueShown && !selectedOption && (
        <TouchableOpacity style={styles.clueButton} onPress={showClue}>
          <Text style={styles.clueButtonText}>İpucu Göster</Text>
        </TouchableOpacity>
      )}
      
      {showAnswer && isCorrect && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.correctText}>Doğru!</Text>
          <Text style={styles.pointsText}>+{roundScore} puan</Text>
        </View>
      )}
      
      {showAnswer && !isCorrect && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.wrongText}>Yanlış!</Text>
          <Text style={styles.answerText}>Doğru cevap: {correctCountry?.name}</Text>
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  roundText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  levelText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  flagContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  flagWrapper: {
    width: width * 0.7,
    height: width * 0.4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    overflow: 'hidden',
  },
  flagImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  questionText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  clueText: {
    fontSize: FONT_SIZES.md,
    fontStyle: 'italic',
    color: COLORS.accent,
    marginTop: SPACING.sm,
  },
  optionsContainer: {
    marginBottom: SPACING.lg,
  },
  optionButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  optionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: COLORS.success,
  },
  wrongOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: COLORS.danger,
  },
  correctOptionText: {
    color: COLORS.success,
    fontWeight: 'bold',
  },
  wrongOptionText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  clueButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 20,
    marginTop: SPACING.md,
  },
  clueButtonText: {
    color: COLORS.accent,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  correctText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  wrongText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  answerText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  pointsText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
});

export default CountryFinder; 