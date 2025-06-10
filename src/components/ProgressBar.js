import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

/**
 * İlerleme çubuğu bileşeni.
 * Uygulamada tutarlı bir ilerleme çubuğu stili sağlar.
 * 
 * @param {object} props - Bileşen özellikleri
 * @param {number} props.progress - İlerleme değeri (0-100)
 * @param {string} props.type - İlerleme çubuğu tipi ('default', 'primary', 'success', 'warning', 'danger')
 * @param {boolean} props.showPercentage - Yüzde değerini göster/gizle
 * @param {string} props.height - İlerleme çubuğu yüksekliği
 * @param {object} props.style - Ek stil özellikleri
 * @param {boolean} props.animated - Animasyonlu gösterim
 */
const ProgressBar = ({
  progress = 0,
  type = 'primary',
  showPercentage = false,
  height = 8,
  style,
  animated = true,
  ...props
}) => {
  // İlerleme değerini 0-100 aralığında sınırla
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // İlerleme çubuğu tipine göre stil belirleme
  const getProgressTypeStyle = () => {
    switch (type) {
      case 'success':
        return styles.successProgress;
      case 'warning':
        return styles.warningProgress;
      case 'danger':
        return styles.dangerProgress;
      case 'default':
        return styles.defaultProgress;
      default:
        return styles.primaryProgress;
    }
  };

  return (
    <View style={[styles.container, style]} {...props}>
      <View
        style={[
          styles.progressBar,
          { height },
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            getProgressTypeStyle(),
            {
              width: `${normalizedProgress}%`,
              height: '100%',
            },
          ]}
        />
      </View>
      
      {showPercentage && (
        <Text style={styles.percentageText}>{`${Math.round(normalizedProgress)}%`}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: 4,
  },
  percentageText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#757575',
  },
  
  // İlerleme çubuğu tipleri
  defaultProgress: {
    backgroundColor: '#9E9E9E',
  },
  primaryProgress: {
    backgroundColor: '#1E88E5',
  },
  successProgress: {
    backgroundColor: '#4CAF50',
  },
  warningProgress: {
    backgroundColor: '#FF9800',
  },
  dangerProgress: {
    backgroundColor: '#F44336',
  },
});

export default ProgressBar; 