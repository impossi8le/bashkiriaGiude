// CrossLoadingScreen.js
import React from 'react';
import { View, ActivityIndicator, ImageBackground, StyleSheet, Dimensions } from 'react-native';

const CrossLoadingScreen = () => {
  return (
    <ImageBackground 
      source={require('../assets/img/crossback.png')} // Укажите путь к вашему изображению
      style={styles.container}
    >
      <ActivityIndicator size="large" color="#0000ff" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width, // Полная ширина экрана
    height: Dimensions.get('window').height, // Полная высота экрана
  },
});

export default CrossLoadingScreen;
