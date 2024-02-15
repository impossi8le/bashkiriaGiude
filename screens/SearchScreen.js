// HomeScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FlatList } from 'react-native';
// import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CachedImage from '../components/CachedImage';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка мест
  useEffect(() => {
    // Function to fetch places
    const fetchPlaces = async () => {
      const response = await fetch('https://bashkiriaguide.com/api/places');
      const json = await response.json();
      setPlaces(json.data);
    };
  
    // Only fetch places if the array is empty
    if (places.length === 0) {
      fetchPlaces();
    }
  }, [places]); // Add places as a dependency

  // Убираем кнопку "Назад" из заголовка
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: true,
    });
  }, [navigation]);

  // Get the header height dynamically
  const onHeaderLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  const renderPlaceItem = ({ item }) => {
    const imageCacheKey = `place-${item.id}-image`; // A unique key for caching the image
    const attributeCacheKeys = item.attributes.map(attr => `attribute-${attr.id}-image`); // Unique keys for each attribute image

    return (
      <View style={styles.placeItem}>
        <CachedImage 
          source={{ uri: item.img ? `https://bashkiriaguide.com/storage/${item.img}` : 'placeholder_image_url' }} 
          cacheKey={imageCacheKey}
          style={styles.placeImage} 
        />
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{item.name}</Text>
          <Text style={styles.placeAddress}>{item.address}</Text>
          <View style={styles.attributesContainer}>
            {item.attributes.map((attribute, index) => (
              <CachedImage
                key={attribute.id}
                source={{ uri: `https://bashkiriaguide.com/storage/${attribute.img}` }}
                cacheKey={attributeCacheKeys[index]}
                style={styles.attributeImage}
              />
            ))}
          </View>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('ObjectCard', { placeId: item.id })}
          >
            <Text style={styles.detailsButtonText}>Подробнее</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  

  // Фильтрация мест в зависимости от запроса
  const filteredPlaces = places.filter(place => {
    const searchLowerCase = searchQuery.toLowerCase();
    return (
      place.name.toLowerCase().includes(searchLowerCase) ||
      (place.address && place.address.toLowerCase().includes(searchLowerCase)) ||
      (place.attributes && place.attributes.some(attribute => attribute.name.toLowerCase().includes(searchLowerCase)))
    );
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom', 'top']} style={{ backgroundColor: '#fff', flex: 1 }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPlaceItem}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    // borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь
  },
  attributesContainer:{
    flexDirection: 'row',
  },
  attributeImage: {
    width: 15,
    height: 15,
    marginRight: 5
  },
  placeItem: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1, // for android shadow
    shadowColor: '#000', // for ios shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  placeImage: {
    padding: 10,
    width: '48%',
    // height: 100,
    height: 'auto'

  },
  placeInfo: {
    padding: 10,
    justifyContent: 'space-between',
    flex: 1,
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь

  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь

  },
  placeAddress: {
    fontSize: 12,
    color: 'grey',
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь

  },
  detailsButton: {
    // Определите свои стили для кнопки
    backgroundColor: '#373571', // Пример цвета фона
    paddingHorizontal: 15, // Горизонтальный паддинг
    paddingVertical: 10, // Вертикальный паддинг
    borderRadius: 5, // Скругление углов
    marginTop: 10, // Отступ сверху
  },
  detailsButtonText: {
    // Определите свои стили для текста внутри кнопки
    color: 'white', // Цвет текста
    textAlign: 'center', // Выравнивание текста
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь

  },
  // ... остальные стили
});

export default SearchScreen;


