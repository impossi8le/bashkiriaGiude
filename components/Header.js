// Header.js
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { Animated, Modal, View, StyleSheet, TouchableOpacity, Image, Text,  Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Header = () => {
  const navigation = useNavigation();
  const [menuData, setMenuData] = useState([]); 
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const name = await AsyncStorage.getItem('userName'); // Предполагается, что имя пользователя сохраняется под ключом 'userName'
      console.log(name);
      if (token && name) {
        setUserName(name);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');

    // await AsyncStorage.removeItem('userName'); // Удаление имени пользователя, если оно сохранялось
    // navigation.navigate('Login'); // Перенаправление на экран входа
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://bashkiriaguide.com/api/categories');
        const json = await response.json();
        setMenuData(json.data); // Store the data in the state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);



  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const goToMapWinterScreen = () => {
    navigation.navigate('MapWinter');
  };

  const goToMapSummerScreen = () => {
    navigation.navigate('MapSummer');
  };

  const goToLoginScreen = () => {
    navigation.navigate('Login');
  };

  const goToRegisterScreen = () => {
    navigation.navigate('Register');
  };

  const renderDrawerMenu = () => {
    return menuData.map((category, index) => {
      const handlePress = () => {
        handleCloseMenu();
        navigation.navigate('Home', { categoryId: category.id });
      };

      return (
        <TouchableOpacity key={index} onPress={handlePress}>
          <Text style={category.parent_id === null || category.parent_id === category.id ? styles.menuItem : styles.subMenuItem}>
            {category.name}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };
  

  return (
    <SafeAreaView edges={['bottom', 'top']} style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <Image
          source={require('../assets/header/lupa.png')} // Update with the correct path to your asset
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          source={require('../assets/header/home.png')} // Update with the correct path to your asset
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleMenu}>
        <Image
          source={require('../assets/header/menu.png')} // Update with the correct path to your asset
          style={styles.icon}
        />        
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => {
          setIsMenuVisible(!isMenuVisible);
        }}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity onPress={handleCloseMenu} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.ScrollView}>
          {userName ? (
            <View style={{ flexDirection: 'row', alignItems: 'center',  justifyContent: 'space-between' }}>
              <Text  style={styles.menuItem}>Добро пожаловать, {userName}</Text>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.menuItem}>Выйти</Text>
              </TouchableOpacity>
            </View>
            ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={goToLoginScreen}>
                <Text style={styles.menuItem}>
                  Авторизация
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goToRegisterScreen}>
                <Text style={styles.menuItem}>
                  /Регистрация
                </Text>
              </TouchableOpacity>
            </View>
            )}       
            {renderDrawerMenu()}
            <Text style={styles.menuItem}>
              Карты
            </Text>
            <TouchableOpacity onPress={goToMapWinterScreen}>
              <Text style={styles.subMenuItem}>
                Карта зимняя
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToMapSummerScreen}>
              <Text style={styles.subMenuItem}>
                Карта летняя
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,  
    alignItems: 'center',
  },
  icon: {
    width: 24, // Set the width of your icon
    height: 24, // Set the height of your icon
    resizeMode: 'contain', // Ensures the icon scales correctly within the bounds
  },
  menuContainer: {
    position: 'relative',
    // top: 0,
    right: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#ffffffF2',
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'flex-end',

    // Добавьте дополнительные стили для вашего меню
  },
  menuItem: {
    fontFamily: 'Inter',
    fontWeight: '400',
    // lineHeight: 20,
    textAlign: 'left',
    fontSize: 24, // Базовый размер шрифта для элементов с parent_id: null
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь
    marginVertical: 10,
    textAlign: "right",

  },
  subMenuItem: {
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 20,
    textAlign: 'left',
    fontSize: 16, // Меньший размер шрифта для элементов с parent_id: не null
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь
    marginVertical: 5,
    paddingLeft: 15,
    textAlign: "right",
  },
  closeButton: {
    position: 'relative',
    // top: 20, // Регулируйте расположение по нужде
    width: 50, height: 50,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ddd', // Цвет фона кнопки
    borderRadius: 40,
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16, // Размер шрифта
    color: '#333', // Цвет текста
  },
  // Добавьте дополнительные стили для других элементов в вашем Header
});

export default Header;
