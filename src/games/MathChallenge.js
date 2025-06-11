import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';

/**
 * Uçuş Matematiği Oyunu bileşeni.
 * Çocukların matematik becerilerini uçuş konseptiyle geliştiren eğitici bir oyun.
 */
const MathChallenge = ({ onComplete, onFail, setScore, score }) => {
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(5); // Toplam 5 soru
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [hintShown, setHintShown] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // Her soru için 15 saniye
  
  // Sayı animasyonu
  const scaleAnim = new Animated.Value(1);
  
  // Oyun seviyesini takip et (1: toplama, 2: çıkarma, 3: çarpma)
  const [level, setLevel] = useState(1);
  
  // Farklı soru tipleri
  const problemTypes = {
    1: [
      { name: 'altitude', template: 'Uçak {a} metre yükseldi, sonra {b} metre daha yükseldi. Şu an yüksekliği nedir?' },
      { name: 'distance', template: 'Uçak önce {a} km, sonra {b} km daha uçtu. Toplam kaç km yol almıştır?' },
      { name: 'passengers', template: 'Uçağa önce {a} yolcu bindi, sonra {b} yolcu daha bindi. Uçakta kaç yolcu var?' },
    ],
    2: [
      { name: 'altitude', template: 'Uçak {a} metredeyken {b} metre alçaldı. Şu an yüksekliği nedir?' },
      { name: 'distance', template: 'Uçağın gideceği yol {a} km idi. {b} km yol gitti. Kaç km kaldı?' },
      { name: 'fuel', template: 'Uçakta {a} litre yakıt vardı. {b} litre yakıt harcandı. Kaç litre yakıt kaldı?' },
    ],
    3: [
      { name: 'flights', template: 'Havaalanından günde {a} uçak kalkıyor. {b} günde kaç uçak kalkar?' },
      { name: 'seats', template: 'Bir uçakta {a} sıra var. Her sırada {b} koltuk bulunuyor. Uçakta toplam kaç koltuk var?' },
      { name: 'tickets', template: 'Bir bilet {a} TL. {b} kişilik bir aile için toplam bilet ücreti ne kadardır?' },
    ],
  };
  
  // Seviyeye göre zorluk ayarları
  const difficultySettings = {
    1: { min: 5, max: 20 }, // Toplama: 5-20 arası sayılar
    2: { min: 10, max: 50 }, // Çıkarma: 10-50 arası sayılar (her zaman pozitif sonuç)
    3: { min: 2, max: 10 }, // Çarpma: 2-10 arası sayılar
  };
  
  // Rastgele sayı üretme
  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Yeni problem oluştur
  const generateProblem = () => {
    const settings = difficultySettings[level];
    const problemList = problemTypes[level];
    const problemType = problemList[Math.floor(Math.random() * problemList.length)];
    
    let a, b, answer;
    
    if (level === 1) {
      // Toplama problemi
      a = getRandomNumber(settings.min, settings.max);
      b = getRandomNumber(settings.min, settings.max);
      answer = a + b;
    } else if (level === 2) {
      // Çıkarma problemi (sonuç her zaman pozitif olacak)
      a = getRandomNumber(settings.min, settings.max);
      b = getRandomNumber(settings.min, a); // b her zaman a'dan küçük olacak
      answer = a - b;
    } else {
      // Çarpma problemi
      a = getRandomNumber(settings.min, settings.max);
      b = getRandomNumber(settings.min, settings.max);
      answer = a * b;
    }
    
    // Problemi metin olarak oluştur
    const text = problemType.template
      .replace('{a}', a)
      .replace('{b}', b);
    
    // Seçenekleri oluştur (1 doğru, 3 yanlış)
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      let wrongAnswer;
      const randomOffset = getRandomNumber(1, 5) * (Math.random() > 0.5 ? 1 : -1);
      
      if (level === 3) {
        // Çarpma için yanlış cevaplar daha farklı olabilir
        const options = [
          a * (b + randomOffset), // Yanlış çarpan
          (a + randomOffset) * b, // Yanlış çarpan
          a + b, // Toplama hatası
        ];
        wrongAnswer = options[wrongOptions.length];
      } else {
        wrongAnswer = answer + randomOffset;
      }
      
      // Yanlış cevap doğru cevapla aynı olmamalı ve negatif olmamalı
      if (wrongAnswer !== answer && wrongAnswer > 0 && !wrongOptions.includes(wrongAnswer)) {
        wrongOptions.push(wrongAnswer);
      }
    }
    
    // Tüm seçenekleri birleştir ve karıştır
    const allOptions = [answer, ...wrongOptions];
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    return {
      text,
      a,
      b,
      answer,
      options: allOptions,
    };
  };
  
  // Oyunu başlat veya sonraki soruya geç
  const startNextRound = () => {
    const newProblem = generateProblem();
    
    setProblem(newProblem);
    setOptions(newProblem.options);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowAnswer(false);
    setHintShown(false);
    setRoundScore(0);
    setTimeLeft(15);
    
    // Sayı animasyonu
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // İlk yükleme ve seviye değişiminde oyunu başlat
  useEffect(() => {
    startNextRound();
  }, [level]);
  
  // Zamanlayıcı
  useEffect(() => {
    if (selectedOption !== null || showAnswer) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Süre doldu, yanlış cevap
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [selectedOption, showAnswer, round]);
  
  // Süre dolduğunda
  const handleTimeUp = () => {
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
  };
  
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
    const correct = option === problem.answer;
    setIsCorrect(correct);
    
    // Puan hesaplama
    let points = 0;
    if (correct) {
      // Temel puan
      points = 10;
      
      // Seviye bonusu
      points += (level - 1) * 5;
      
      // Zaman bonusu
      points += Math.floor(timeLeft / 3);
      
      // İpucu kullanılmadıysa bonus
      if (!hintShown) {
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
  const showHint = () => {
    setHintShown(true);
  };
  
  // İşlem ipucunu oluştur
  const getHintText = () => {
    if (!problem) return '';
    
    if (level === 1) {
      return `${problem.a} + ${problem.b} = ?`;
    } else if (level === 2) {
      return `${problem.a} - ${problem.b} = ?`;
    } else {
      return `${problem.a} × ${problem.b} = ?`;
    }
  };
  
  // Seviye açıklaması
  const getLevelDescription = () => {
    if (level === 1) return 'Toplama İşlemleri';
    if (level === 2) return 'Çıkarma İşlemleri';
    return 'Çarpma İşlemleri';
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roundText}>Tur: {round}/{maxRounds}</Text>
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Seviye {level}: </Text>
          <Text style={styles.levelDescription}>{getLevelDescription()}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={[
            styles.timerText,
            timeLeft <= 5 && styles.timerWarning
          ]}>
            {timeLeft}s
          </Text>
        </View>
      </View>
      
      <View style={styles.problemContainer}>
        <Animated.Text 
          style={[
            styles.problemText,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          {problem?.text}
        </Animated.Text>
        
        {hintShown && (
          <Text style={styles.hintText}>{getHintText()}</Text>
        )}
      </View>
      
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && (isCorrect ? styles.correctOption : styles.wrongOption),
              showAnswer && option === problem?.answer && styles.correctOption,
            ]}
            onPress={() => selectOption(option)}
            disabled={selectedOption !== null}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && (isCorrect ? styles.correctOptionText : styles.wrongOptionText),
                showAnswer && option === problem?.answer && styles.correctOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {!hintShown && !selectedOption && !showAnswer && (
        <TouchableOpacity style={styles.hintButton} onPress={showHint}>
          <Text style={styles.hintButtonText}>İpucu Göster</Text>
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
          <Text style={styles.answerText}>Doğru cevap: {problem?.answer}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  roundText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  levelDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
  },
  timerContainer: {
    backgroundColor: COLORS.lightGrey,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
  },
  timerText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  timerWarning: {
    color: COLORS.danger,
  },
  problemContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  problemText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  hintText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: SPACING.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  optionButton: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  optionText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
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
  },
  wrongOptionText: {
    color: COLORS.danger,
  },
  hintButton: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 20,
  },
  hintButtonText: {
    color: COLORS.accent,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
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

export default MathChallenge; 