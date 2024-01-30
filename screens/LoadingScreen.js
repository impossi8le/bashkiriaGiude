// LoadingScreen.js
import React, { useEffect, useLayoutEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, SafeAreaView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import { color } from 'react-native-reanimated';

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate an async operation like fetching data
    const timeoutId = setTimeout(() => {
      navigation.navigate('Home');
    });

    return () => clearTimeout(timeoutId);
  }, [navigation]);

  // Убираем кнопку "Назад" из заголовка
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/img/bashkortostan-logo.png')} // Replace with the path to your logo image
          style={styles.logo}
        />
         <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
      </View>
      {/* <Text style={styles.title}>ПУТЕВОДИТЕЛЬ ПО БАШКОРТОСТАНУ</Text> */}
     
      <View style={styles.titleContainer}>  
        <View style={styles.supportContainer}>
          <Image
            source={require('../assets/img/convert.png')} // Replace with the path to your logo image
            style={styles.convertIcon}
          />      
          <Text style={styles.supportText}>разработано при поддержке</Text>
        </View>
        <Text style={styles.footerText}>Сообщить об ошибке/контакты</Text>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>лицензионное соглашение</Text>
          <Text style={styles.footerText}>политика конфиденциальности</Text>
        </View>
      </View>     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 0.7,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 0.3,
    width: '100%',
    backgroundColor: '#302C66',
  },
  logo: {
    width: 1900,  // Full width of the container
    height: '100%', // Full height of the container
    resizeMode: 'contain' // This ensures the image is scaled proportionally
  },
  convert: {
    width: '15vw',
    height: '15vw',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#373571',
    width: '50%',
  },
  activityIndicator: {
    marginBottom: 20,
    position: 'absolute',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    flexShrink: 1,

  },
  supportContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
    marginBottom: 5, // Add some space below the container
  },
  convertIcon: {
    width: 53, // Adjust width as needed
    height: 47, // Adjust height as needed
    marginRight: 10, // Add space between the icon and text
  },
  supportText: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 1,
  },
  footerContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
    marginBottom: 5, // Add some space below the container
  },
});

export default LoadingScreen;

