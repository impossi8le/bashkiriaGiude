// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

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
      if (json.success) {
        // Handle successful login, e.g., save the token, navigate to the home screen
      } else {
        Alert.alert('Ошибка', 'Неверные учетные данные');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при попытке входа');
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Войти" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
