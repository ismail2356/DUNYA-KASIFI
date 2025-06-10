import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Rozet bileşeni.
 * Uygulamada tutarlı bir rozet stili sağlar.
 * 
 * @param {object} props - Bileşen özellikleri
 * @param {string} props.text - Rozet metni
 * @param {string} props.type - Rozet tipi ('default', 'primary', 'success', 'warning', 'danger', 'info')
 * @param {string} props.size - Rozet boyutu ('small', 'medium', 'large')
 * @param {object} props.style - Ek stil özellikleri
 * @param {object} props.textStyle - Metin stil özellikleri
 */
const Badge = ({
  text,
  type = 'default',
  size = 'medium',
  style,
  textStyle,
  ...props
}) => {
  // Rozet tipine göre stil belirleme
  const getBadgeTypeStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryBadge;
      case 'success':
        return styles.successBadge;
      case 'warning':
        return styles.warningBadge;
      case 'danger':
        return styles.dangerBadge;
      case 'info':
        return styles.infoBadge;
      default:
        return styles.defaultBadge;
    }
  };

  // Rozet boyutuna göre stil belirleme
  const getBadgeSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallBadge;
      case 'large':
        return styles.largeBadge;
      default:
        return styles.mediumBadge;
    }
  };

  // Rozet metni tipine göre stil belirleme
  const getTextTypeStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryBadgeText;
      case 'success':
        return styles.successBadgeText;
      case 'warning':
        return styles.warningBadgeText;
      case 'danger':
        return styles.dangerBadgeText;
      case 'info':
        return styles.infoBadgeText;
      default:
        return styles.defaultBadgeText;
    }
  };

  // Rozet metni boyutuna göre stil belirleme
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallBadgeText;
      case 'large':
        return styles.largeBadgeText;
      default:
        return styles.mediumBadgeText;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getBadgeTypeStyle(),
        getBadgeSizeStyle(),
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.badgeText,
          getTextTypeStyle(),
          getTextSizeStyle(),
          textStyle,
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontWeight: 'bold',
  },
  
  // Rozet tipleri
  defaultBadge: {
    backgroundColor: '#E0E0E0',
  },
  primaryBadge: {
    backgroundColor: '#E3F2FD',
  },
  successBadge: {
    backgroundColor: '#E8F5E9',
  },
  warningBadge: {
    backgroundColor: '#FFF3E0',
  },
  dangerBadge: {
    backgroundColor: '#FFEBEE',
  },
  infoBadge: {
    backgroundColor: '#E1F5FE',
  },
  
  // Rozet boyutları
  smallBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  mediumBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  largeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  
  // Metin tipleri
  defaultBadgeText: {
    color: '#757575',
  },
  primaryBadgeText: {
    color: '#1E88E5',
  },
  successBadgeText: {
    color: '#4CAF50',
  },
  warningBadgeText: {
    color: '#FF9800',
  },
  dangerBadgeText: {
    color: '#F44336',
  },
  infoBadgeText: {
    color: '#03A9F4',
  },
  
  // Metin boyutları
  smallBadgeText: {
    fontSize: 10,
  },
  mediumBadgeText: {
    fontSize: 12,
  },
  largeBadgeText: {
    fontSize: 14,
  },
});

export default Badge; 