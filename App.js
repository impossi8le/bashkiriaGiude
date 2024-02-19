// app.js
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import ObjectCardScreen from './screens/ObjectCardScreen';
import MapScreenWinter from './screens/MapScreenWinter';
import MapScreenSummer from './screens/MapScreenSummer';
import SearchScreen from './screens/SearchScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import Header from './components/Header';

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Отдельный useEffect для загрузки шрифтов
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Akrobat-SemiBold': require('./assets/fonts/AkrobatSemiBold.ttf'),
        'Inter': require('./assets/fonts/Inter.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  // useEffect для подписки на изменения состояния сети
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe(); // Отписка от обновлений состояния сети
  }, []);

  // Проверка наличия интернет-соединения
  useEffect(() => {
    if (!isConnected) {
      Alert.alert(
        "Нет интернет-соединения",
        "Для работы приложения необходимо интернет-соединение",
        [{ text: "Закрыть приложение", onPress: () => BackHandler.exitApp() }],
        { cancelable: false }
      );
    }
  }, [isConnected]);

  if (!fontsLoaded || !isConnected) {
    return (
      <Text>
        Отсутствует интернет соединение!! Перезапустите приложение после появления интернет соединения.
      </Text>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          header: (props) => <Header {...props} />, // Используйте Header компонент
          headerStyle: {
            backgroundColor: '#fff', // Установите фон заголовка
          },
        }}
      >
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ObjectCard" component={ObjectCardScreen} />
        <Stack.Screen name="MapWinter" component={MapScreenWinter} />
        <Stack.Screen name="MapSummer" component={MapScreenSummer} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
