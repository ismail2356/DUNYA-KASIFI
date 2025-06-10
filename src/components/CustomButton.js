import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

/**
 * Özel buton bileşeni.
 * Uygulamada tutarlı bir buton stili sağlar.
 * 
 * @param {object} props - Bileşen özellikleri
 * @param {string} props.title - Buton metni
 * @param {function} props.onPress - Tıklama olayı işleyicisi
 * @param {string} props.type - Buton tipi ('primary', 'secondary', 'outline', 'danger')
 * @param {string} props.size - Buton boyutu ('small', 'medium', 'large')
 * @param {object} props.style - Ek stil özellikleri
 * @param {object} props.textStyle - Metin stil özellikleri
 * @param {boolean} props.disabled - Butonun devre dışı olup olmadığı
 */
const CustomButton = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
  ...props
}) => {
  // Buton tipine göre stil belirleme
  const getButtonTypeStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  // Buton boyutuna göre stil belirleme
  const getButtonSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Buton metni tipine göre stil belirleme
  const getTextTypeStyle = () => {
    switch (type) {
      case 'outline':
        return styles.outlineButtonText;
      case 'secondary':
        return styles.secondaryButtonText;
      case 'danger':
        return styles.dangerButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  // Buton metni boyutuna göre stil belirleme
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButtonText;
      case 'large':
        return styles.largeButtonText;
      default:
        return styles.mediumButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonTypeStyle(),
        getButtonSizeStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text
        style={[
          styles.buttonText,
          getTextTypeStyle(),
          getTextSizeStyle(),
          disabled && styles.disabledButtonText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  
  // Buton tipleri
  primaryButton: {
    backgroundColor: '#1E88E5',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
    borderColor: '#BDBDBD',
  },
  
  // Buton boyutları
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  
  // Metin tipleri
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
  },
  outlineButtonText: {
    color: '#1E88E5',
  },
  dangerButtonText: {
    color: '#FFFFFF',
  },
  disabledButtonText: {
    color: '#757575',
  },
  
  // Metin boyutları
  smallButtonText: {
    fontSize: 12,
  },
  mediumButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 16,
  },
});

export default CustomButton; 