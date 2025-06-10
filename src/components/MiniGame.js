import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../utils/constants';
import CustomButton from './CustomButton';

/**
 * Mini oyun bileşeni.
 * Çeşitli eğitici oyunlar için temel yapıyı sağlar.
 * 
 * @param {object} props - Bileşen özellikleri
 * @param {string} props.title - Oyun başlığı
 * @param {string} props.description - Oyun açıklaması
 * @param {React.ReactNode} props.children - Oyun içeriği
 * @param {function} props.onComplete - Oyun tamamlandığında çağrılacak fonksiyon
 * @param {function} props.onClose - Oyun kapatıldığında çağrılacak fonksiyon
 * @param {boolean} props.showTimer - Zamanlayıcı göster/gizle
 * @param {number} props.timeLimit - Zaman sınırı (saniye)
 * @param {string} props.difficulty - Zorluk seviyesi ('easy', 'medium', 'hard')
 * @param {number} props.points - Kazanılacak puan
 */
const MiniGame = ({
  title,
  description,
  children,
  onComplete,
  onClose,
  showTimer = false,
  timeLimit = 60,
  difficulty = 'medium',
  points = 10,
}) => {
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'completed', 'failed'
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [score, setScore] = useState(0);
  
  // Zamanlayıcı animasyonu
  const timerAnimation = new Animated.Value(1);
  
  // Zorluk seviyesine göre renk belirleme
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return COLORS.success;
      case 'hard':
        return COLORS.danger;
      default:
        return COLORS.primary;
    }
  };
  
  // Oyunu başlat
  const startGame = () => {
    setGameState('playing');
    setTimeRemaining(timeLimit);
    setScore(0);
    
    // Timer animasyonu
    if (showTimer) {
      Animated.timing(timerAnimation, {
        toValue: 0,
        duration: timeLimit * 1000,
        useNativeDriver: false,
      }).start();
    }
  };
  
  // Oyunu tamamla
  const completeGame = (finalScore) => {
    setGameState('completed');
    setScore(finalScore || score);
    if (onComplete) {
      onComplete({
        score: finalScore || score,
        timeSpent: timeLimit - timeRemaining,
        difficulty,
      });
    }
  };
  
  // Oyunu başarısız olarak bitir
  const failGame = () => {
    setGameState('failed');
  };
  
  // Oyunu kapat
  const closeGame = () => {
    if (onClose) {
      onClose();
    }
  };
  
  // Zamanlayıcı efekti
  useEffect(() => {
    let timer;
    
    if (gameState === 'playing' && showTimer) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            failGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [gameState, showTimer]);
  
  // Giriş ekranı
  if (gameState === 'intro') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Zorluk:</Text>
            <Text style={[styles.infoValue, { color: getDifficultyColor() }]}>
              {difficulty === 'easy' ? 'Kolay' : difficulty === 'hard' ? 'Zor' : 'Orta'}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Puan:</Text>
            <Text style={styles.infoValue}>{points}</Text>
          </View>
          
          {showTimer && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Süre:</Text>
              <Text style={styles.infoValue}>{timeLimit} saniye</Text>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Başla"
            onPress={startGame}
            type="primary"
            size="large"
          />
          <CustomButton
            title="Kapat"
            onPress={closeGame}
            type="outline"
            size="medium"
            style={styles.closeButton}
          />
        </View>
      </View>
    );
  }
  
  // Oyun tamamlandı ekranı
  if (gameState === 'completed') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tebrikler!</Text>
        <Text style={styles.description}>Oyunu başarıyla tamamladınız.</Text>
        
        <View style={styles.resultContainer}>
          <Text style={styles.scoreLabel}>Kazanılan Puan:</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Tekrar Oyna"
            onPress={startGame}
            type="primary"
            size="medium"
          />
          <CustomButton
            title="Kapat"
            onPress={closeGame}
            type="outline"
            size="medium"
            style={styles.closeButton}
          />
        </View>
      </View>
    );
  }
  
  // Oyun başarısız ekranı
  if (gameState === 'failed') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Süre Doldu!</Text>
        <Text style={styles.description}>Bir dahaki sefere daha hızlı olmaya çalışın.</Text>
        
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Tekrar Dene"
            onPress={startGame}
            type="primary"
            size="medium"
          />
          <CustomButton
            title="Kapat"
            onPress={closeGame}
            type="outline"
            size="medium"
            style={styles.closeButton}
          />
        </View>
      </View>
    );
  }
  
  // Oyun ekranı
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.gameTitle}>{title}</Text>
        
        {showTimer && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{timeRemaining}s</Text>
            <View style={styles.timerBar}>
              <Animated.View
                style={[
                  styles.timerProgress,
                  {
                    width: timerAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: timerAnimation.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [COLORS.danger, COLORS.warning, COLORS.success],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}
        
        <TouchableOpacity style={styles.closeIcon} onPress={closeGame}>
          <Text style={styles.closeIconText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.gameContent}>
        {React.cloneElement(children, {
          onComplete: completeGame,
          onFail: failGame,
          setScore,
          score,
          timeRemaining,
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    margin: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  gameTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: SPACING.xl,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  closeButton: {
    marginTop: SPACING.md,
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  timerText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: SPACING.xs,
    width: 30,
  },
  timerBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    borderRadius: 4,
  },
  closeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  scoreLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default MiniGame; 