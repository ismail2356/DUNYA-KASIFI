import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

const EiffelTower3D = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Paris - Eyfel Kulesi</Text>
      <Image
        source={require('../../assets/images/stitch-eiffel.jpg')}
        style={styles.eiffelImage}
        resizeMode="contain"
      />
      <Text style={styles.description}>
        🗼 Stitch ile Eyfel Kulesi macerası!{'\n'}
        Paris'te sevimli bir anı 💙✨
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c2c54',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#40E0D0',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  eiffelImage: {
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  description: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 25,
    lineHeight: 26,
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default EiffelTower3D; 