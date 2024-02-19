// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://bashkiriaguide.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const json = await response.json();
      if (response.ok && json.token) { // Проверка успешного ответа и наличия токена
        // Сохранение user_id и token в AsyncStorage
        await AsyncStorage.setItem('userToken', JSON.stringify(json.token)); // Сохраняем весь объект токена
        await AsyncStorage.setItem('userId', json.token.tokenable_id.toString());
        await AsyncStorage.setItem('username', json.username);
        
        // Переход на главный экран
        navigation.navigate('Home');
      } else {
        // Если json.error существует, используем его, иначе используем общее сообщение об ошибке
        Alert.alert('Ошибка', json.error || 'Неверные учетные данные');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при попытке входа');
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Пароль"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Авторизоваться</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
        <Text style={styles.buttonText}>Еще нет аккаунта? Регистрация</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
