import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Özel kart bileşeni.
 * Uygulamada tutarlı bir kart stili sağlar.
 * 
 * @param {object} props - Bileşen özellikleri
 * @param {string} props.title - Kart başlığı
 * @param {string} props.subtitle - Kart alt başlığı
 * @param {React.ReactNode} props.children - Kart içeriği
 * @param {function} props.onPress - Tıklama olayı işleyicisi
 * @param {string} props.type - Kart tipi ('default', 'info', 'success', 'warning', 'danger')
 * @param {object} props.style - Ek stil özellikleri
 * @param {boolean} props.elevated - Kart gölgeli mi
 */
const CustomCard = ({
  title,
  subtitle,
  children,
  onPress,
  type = 'default',
  style,
  elevated = true,
  ...props
}) => {
  // Kart tipine göre stil belirleme
  const getCardTypeStyle = () => {
    switch (type) {
      case 'info':
        return styles.infoCard;
      case 'success':
        return styles.successCard;
      case 'warning':
        return styles.warningCard;
      case 'danger':
        return styles.dangerCard;
      default:
        return styles.defaultCard;
    }
  };

  // Başlık tipine göre stil belirleme
  const getTitleTypeStyle = () => {
    switch (type) {
      case 'info':
        return styles.infoTitle;
      case 'success':
        return styles.successTitle;
      case 'warning':
        return styles.warningTitle;
      case 'danger':
        return styles.dangerTitle;
      default:
        return styles.defaultTitle;
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        getCardTypeStyle(),
        elevated && styles.elevatedCard,
        style,
      ]}
      onPress={onPress}
      disabled={!onPress}
      {...props}
    >
      {title && (
        <View style={styles.headerContainer}>
          <Text style={[styles.title, getTitleTypeStyle()]}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.contentContainer}>{children}</View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginVertical: 8,
  },
  elevatedCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  contentContainer: {},
  
  // Kart tipleri
  defaultCard: {
    borderLeftWidth: 0,
  },
  infoCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#1E88E5',
  },
  successCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  warningCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  dangerCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  
  // Başlık tipleri
  defaultTitle: {
    color: '#333333',
  },
  infoTitle: {
    color: '#1E88E5',
  },
  successTitle: {
    color: '#4CAF50',
  },
  warningTitle: {
    color: '#FF9800',
  },
  dangerTitle: {
    color: '#F44336',
  },
});

export default CustomCard; 