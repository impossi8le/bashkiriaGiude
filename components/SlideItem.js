// SlideItem.js
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import React from 'react';

const { width, height } = Dimensions.get('window');

const SlideItem = ({ item }) => {
  const imageUrl = `https://bashkiriaguide.com/storage/${item.img}`; // Убедитесь, что путь к изображению правильный
  const articleUrl = item.link;
  // console.log(articleUrl);
  
  const openLink = () => {
    Linking.canOpenURL(articleUrl).then(supported => {
      if (supported) {
        Linking.openURL(articleUrl);
      } else {
        console.log("Don't know how to open URI: " + articleUrl);
      }
    });
  };


  return (
    <TouchableOpacity onPress={openLink} style={styles.slideContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.heading}>{item.heading}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  slideContainer: {
    alignItems: 'center',
    width,
    height: height * 0.25,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover', // Убедитесь, что изображение надлежащим образом масштабируется
  },
  textContainer: {
    position: 'absolute',
    bottom: 10, // Установите отступ снизу для текста
    left: 10,
    right: 20, // Установите отступ справа для текста
    padding: 10, // Внутренние отступы для текстового контейнера
    borderRadius: 5, // Скругление углов текстового блока
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    fontFamily: 'Akrobat-SemiBold', // Укажите загруженный шрифт здесь
  },  
  description: {
    fontSize: 15, // Размер шрифта для описания
    color: 'white', // Цвет текста описания
    lineHeight: 20, // Высота строки для описания
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь

  },
});


export default SlideItem;
