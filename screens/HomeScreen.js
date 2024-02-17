// HomeScreen.js
import React, { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Slider from '../components/Slider';
import LoadingScreen from './LoadingScreen';
import { BackHandler, ToastAndroid } from 'react-native';
import CachedImage from '../components/CachedImage';


const HomeScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [state, setState] = useState({
    isLoading: true,
    places: [],
    categories: [],
    backPressedOnce: false,
    attributeModal: { visible: false, name: '' },
    dataLoaded: false,
    categoryId: route.params?.categoryId,
  });
  const flatListRef = useRef();



  // Header show
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !state.isLoading, // Отображать Header только после загрузки данных
    });
  }, [navigation, state.isLoading]);

  // Custom hook to fetch data
  const fetchData = useCallback(async (url) => {
    const response = await fetch(url);
    return response.json();
  }, []);

  // Consolidated data loading logic
  useEffect(() => {
    if (!state.dataLoaded) {
      Promise.all([
        fetchData('https://bashkiriaguide.com/api/categories'),
        fetchData('https://bashkiriaguide.com/api/places')
      ]).then(([categoriesResponse, placesResponse]) => {
        console.log("Места:", placesResponse.data);

        const categoriesData = processCategories(categoriesResponse.data);
        const placesData = placesResponse.data;
        setState(prev => {
          return { ...prev, categories: categoriesData, places: placesData, isLoading: false, dataLoaded: true };
        });
      }).catch(error => {
        console.error("Ошибка при загрузке данных: ", error);
        setState(prev => ({ ...prev, isLoading: false }));
      });
    }
  }, [state.dataLoaded, fetchData]);

  // Processes categories for parent-child relationships
  const processCategories = (categoriesData) => {
    const parentCategoriesMap = categoriesData.reduce((acc, category) => {
      if (category.parent_id === null || category.id === category.parent_id) {
        acc[category.id] = { name: category.name, img: category.img };
      }
      return acc;
    }, {});

    return categoriesData.map(category => ({
      ...category,
      parentCategory: parentCategoriesMap[category.parent_id] || { name: '', img: '' },
    }));
  };

  // Custom hook for back button handling
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!state.backPressedOnce) {
          setState(prev => ({ ...prev, backPressedOnce: true }));
          ToastAndroid.show('Нажмите еще раз, чтобы выйти', ToastAndroid.SHORT);
          setTimeout(() => setState(prev => ({ ...prev, backPressedOnce: false })), 2000);
          return true;
        } else {
          BackHandler.exitApp();
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [state.backPressedOnce])
  );

  // Scroll to category
  const scrollToCategory = useCallback((categoryId) => {
    const index = state.categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  }, [state.categories]);

  useEffect(() => {
    if (route.params?.categoryId) {
      scrollToCategory(route.params.categoryId);
    }
  }, [route.params?.categoryId, scrollToCategory, state.categories]);

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  const placesByCategory = state.categories.map(category => ({
    ...category,
    places: state.places.filter(place => place.subcategoryId === category.id),
  }));

  const renderCategory = ({ item: category }) => {
    if (category.places.length === 0) {
      return null;
    }

    return (
      <CategoryView
        category={category}
        onDetailsPress={handleDetailsPress}
        onAttributePress={handleAttributePress}
      />
    );
  };

  const handleDetailsPress = (placeId) => {
    navigation.navigate('ObjectCard', { placeId });
  };

  const handleAttributePress = (attributeName) => {
    setState(prev => ({ ...prev, attributeModal: { visible: true, name: attributeName } }));
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom', 'top']} style={styles.safeAreaView}>
        <FlatList
          data={placesByCategory}
          renderItem={renderCategory}
          keyExtractor={category => category.id.toString()}
          ListHeaderComponent={Slider}
          ref={flatListRef}
        />

        <AttributeModal
          state={state.attributeModal}
          onClose={() => setState(prev => ({ ...prev, attributeModal: { ...prev.attributeModal, visible: false } }))}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// Component for each category
const CategoryView = ({ category, onDetailsPress, onAttributePress,  }) => {
  return (
    <View 
      style={styles.categoryView}
    >
      <CategoryHeader category={category} />
      {category.parentCategory.name !== category.name && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          {category.img && (
            <Image
              source={{ uri: `https://bashkiriaguide.com/storage/${category.img}` }}
              style={styles.categoryImage}
            />
          )}
          <View style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Text
              style={{
                flexShrink: 1,
                fontSize: 18,
                fontWeight: 'bold',
                fontFamily: 'Inter',
                flexWrap: 'wrap', // This property is not needed as wrapping is default
              }}
              numberOfLines={0} // Setting to 0 should not be necessary unless you have a specific reason
            >
              {category.name}
            </Text>            
          </View>
        </View>
      )}
      <View style={styles.cardContainer}>
        {category.places.map(place => (
          <PlaceCard key={place.id} place={place} onDetailsPress={onDetailsPress} onAttributePress={onAttributePress} />
        ))}
      </View>
    </View>
  );
};

// Header for each category
const CategoryHeader = ({ category }) => {

  const categoryCacheKey = `category-${category.id}`;

  return (
    <View style={styles.categoryHeader}>
      {category.parentCategory.name && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CachedImage
            source={{ uri: `https://bashkiriaguide.com/storage/${category.parentCategory.img}` }}
            cacheKey={categoryCacheKey}
            style={styles.categoryImage}
          />
          <View style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Text
              style={{
                flexShrink: 1,
                fontSize: 20,
                fontWeight: 'bold',
                fontFamily: 'Inter',
                flexWrap: 'wrap', // This property is not needed as wrapping is default
              }}
              numberOfLines={0} // Setting to 0 should not be necessary unless you have a specific reason
            >
              {category.name}
            </Text>            
          </View>
        </View>
      )}
    </View>
  );
};



// Component for each place card
const PlaceCard = ({ place, onDetailsPress, onAttributePress }) => {

  const cacheKey = `place-${place.id}`;


  return (
    <TouchableOpacity
      style={place.orientationImg === '1' ? styles.verticalCard : styles.horizontalCard}
      onPress={() => onDetailsPress(place.id)}
      activeOpacity={1}
    >
      {/* <Image source={{ uri: `https://bashkiriaguide.com/storage/${place.img}` }} style={styles.cardImage} /> */}
      <CachedImage
        source={{ uri: `https://bashkiriaguide.com/storage/${place.img}` }}
        cacheKey={cacheKey}
        style={styles.cardImage}
      />
      <Text style={[styles.placeName, styles.placeName1]}>{place.name}</Text>
      <Text style={[styles.placeName, styles.addresName1]}>{place.address}</Text>
      <AttributesContainer attributes={place.attributes} onPress={onAttributePress} />
      <TouchableOpacity style={styles.detailsButton} onPress={() => onDetailsPress(place.id)}>
        <Text style={styles.detailsButtonText}>Подробнее</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Attributes container for each place card
const AttributesContainer = ({ attributes, onPress }) => {
  return (
    <View style={styles.attributesContainer}>
      {attributes.map(attribute => {
        const attributeCacheKey = `attribute-${attribute.id}`;
        return (
          <TouchableOpacity key={attribute.id} onPress={() => onPress(attribute.name)} style={styles.attributeTouch}>
            <CachedImage
              source={{ uri: `https://bashkiriaguide.com/storage/${attribute.img}` }}
              cacheKey={attributeCacheKey}
              style={styles.attributeImage}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// Modal component for attributes
const AttributeModal = ({ state, onClose }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={state.visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{state.name}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


const styles = StyleSheet.create({
  categoryView:{
    flexDirection: 'column', 
    flexWrap: 'wrap', 
    margin: 3,
    marginTop: 10,
  },
  placeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь
  },
  attributesContainer:{
    flexDirection: 'row',
    marginVertical: 3,
  },
  attributeImage: {
    width: 25,
    height: 25,
    marginRight: 5
  },
  categoryImage: {
    width: 30, // Укажите желаемые размеры
    height: 30, // Укажите желаемые размеры
    marginRight: 10, // Отступ справа
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontFamily: 'Inter', // Укажите загруженный шрифт здесь
    marginVertical: 2,
  },
  placeName1: {
    fontSize: 20,
    fontWeight: 'bold',
    height: 50,
    marginVertical: 5, // Adjust as needed
  },
  addresName1: {
    marginVertical: 5,
    height: 40,
  },
  detailsButton: {
    backgroundColor: '#373571', // Пример цвета фона
    paddingVertical: 10, // Вертикальный паддинг
    borderRadius: 5, // Скругление углов
    bottom: '0%',
    width: '100%',
    marginVertical: 3,    
  },
  detailsButtonText: {
    color: 'white', // Цвет текста
    textAlign: 'center', // Выравнивание текста
  },
  verticalCard: {
    width: '48%', // Take up less than half the width to account for padding
    aspectRatio: 1, // Aspect ratio for vertical images
    paddingVertical: 30, //
    marginVertical: 70, //
    height: 100,
  },
  horizontalCard: {
    width: '100%', // Занимаем всю ширину
    aspectRatio: 16 / 9, // Соотношение сторон карточки для горизонтальных изображений
    alignSelf: 'center', 
    marginVertical: 70, //
    paddingVertical: 30, //
    height: 100,

  },
  cardContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',  
    margin: 5,
    marginBottom: 150,
    marginTop: -40,
    width: '98%',
  },
  cardImage: {
    width: '100%',
    height: '100%', 
    marginBottom: '2%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Inter', 
  },
});

export default HomeScreen;