import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import MapView, { Marker, Polygon, Overlay, PROVIDER_GOOGLE } from 'react-native-maps';
import { Modal, View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import bashkortostanBorderCoordinates from '../components/bashkortostanBorderCoordinates';

import CachedImage from '../components/CachedImage';


const BashkortostanMap = () => {

  const navigation = useNavigation();

  // Состояние для хранения мест
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Create a ref for the MapView
  const mapViewRef = useRef(null);

  // Функция для загрузки данных с API
  useEffect(() => {
    fetch('https://bashkiriaguide.com/api/places')
      .then(response => response.json())
      .then(data => {
        // Фильтрация мест с id атрибута равным 1
        const filteredPlaces = data.data.filter(place =>
          place.attributes.some(attribute => attribute.id === 2)
        );
        setPlaces(filteredPlaces);
      })
      .catch(error => console.error('Ошибка загрузки данных:', error));
  }, []);


  // Северо-восточная точка Башкортостана
  const northeastLat = 57.830091; // примерная широта
  const northeastLon = 60.608559; // примерная долгота

  // Юго-западная точка Башкортостана
  const southwestLat = 49.004570; // примерная широта
  const southwestLon = 52.505088; // примерная долгота

  // Определение границ для Overlay
  const overlayBounds = [
    [southwestLat, southwestLon], // Southwest corner
    [northeastLat, northeastLon], // Northeast corner
  ];

  // Ваши координаты Bashkortostan
  const bashkortostanCoordinates = bashkortostanBorderCoordinates;

  // Координаты для внешнего полигона
  const worldCoordinates = [
    { latitude: 90, longitude: -180 },
    { latitude: 90, longitude: 180 },
    { latitude: -90, longitude: 180 },
    { latitude: -90, longitude: -180 },
  ];

  // Убираем кнопку "Назад" из заголовка
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerShown: true,
    });
  }, [navigation]);

  const onMarkerPress = (place) => {
    setSelectedPlace(place);
  };

  const closeModal = () => {
    setSelectedPlace(null);
  };

  const onDetailsPress = () => {
    if (selectedPlace) {
      closeModal();
      navigation.navigate('ObjectCard', { placeId: selectedPlace.id });
    }
  };

  const mapStyle = [ { "featureType": "administrative", "elementType": "geometry", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [ { "color": "#000000" } ] }, { "featureType": "administrative", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.country", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.land_parcel", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.land_parcel", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.locality", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.locality", "elementType": "geometry.fill", "stylers": [ { "visibility": "on" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "administrative.province", "stylers": [ { "color": "#e6d937" }, { "visibility": "on" } ] }, { "featureType": "administrative.province", "elementType": "geometry.fill", "stylers": [ { "color": "#e6d937" }, { "visibility": "on" } ] }, { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [ { "color": "#ffffff" }, { "visibility": "on" } ] }, { "featureType": "administrative.province", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] }, { "featureType": "landscape", "stylers": [ { "color": "#e6d937" }, { "visibility": "on" } ] }, { "featureType": "poi", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi", "elementType": "labels.text", "stylers": [ { "visibility": "off" } ] }, { "featureType": "poi.business", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road", "stylers": [ { "visibility": "on" } ] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [ { "color": "#e49432" }, { "visibility": "on" } ] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "color": "#e49432" }, { "weight": 1 } ] }, { "featureType": "road", "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [ { "color": "#e49432" }, { "weight": 5 } ] }, { "featureType": "road.arterial", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.highway", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [ { "color": "#e49432" }, { "weight": 8 } ] }, { "featureType": "road.local", "elementType": "labels", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [ { "color": "#8d8b8b" }, { "visibility": "on" }, { "weight": 2 } ] }, { "featureType": "transit.line", "elementType": "geometry.stroke", "stylers": [ { "color": "#000000" }, { "visibility": "on" }, { "weight": 8 } ] }, { "featureType": "transit.station.rail", "stylers": [ { "visibility": "on" } ] }, { "featureType": "transit.station.rail", "elementType": "geometry.fill", "stylers": [ { "color": "#000000" }, { "visibility": "on" }, { "weight": 8 } ] }, { "featureType": "transit.station.rail", "elementType": "geometry.stroke", "stylers": [ { "color": "#000000" }, { "visibility": "on" }, { "weight": 8 } ] }, { "featureType": "water", "stylers": [ { "visibility": "on" } ] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [ { "color": "#bce4fa" }, { "visibility": "on" } ] }, { "featureType": "water", "elementType": "geometry.stroke", "stylers": [ { "color": "#1d9add" }, { "visibility": "on" }, { "weight": 4 } ] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [ { "visibility": "off" } ] } ];
  const markerImageStyle2 = {
    width: 60,   // Установите желаемую ширину
    height: 60,  // Установите желаемую высоту
  };

  // Function to handle region change
  const onRegionChangeComplete = (region) => {
    // Define the bounds of Bashkortostan
    const bounds = {
      north: northeastLat,
      south: southwestLat,
      east: northeastLon,
      west: southwestLon
    };
  
    // Check if the new region is outside of Bashkortostan bounds
    if (region.latitude > bounds.north || region.latitude < bounds.south ||
        region.longitude > bounds.east || region.longitude < bounds.west) {
      // Reset to initialRegion if outside bounds
      mapViewRef.current?.animateToRegion({
        latitude: (northeastLat + southwestLat) / 2,
        longitude: (northeastLon + southwestLon) / 2,
        latitudeDelta: Math.abs(northeastLat - southwestLat),
        longitudeDelta: Math.abs(northeastLon - southwestLon),
      }, 500); // Adjust duration as needed
    }
  };

  const openMap = () => {
    // Ensure there is a selected place
    if (!selectedPlace) {
      console.warn('No place selected');
      return;
    }
  
    // Check if location is available, if so use the point, otherwise use the address
    const mapQuery = selectedPlace.location && selectedPlace.location.point 
      ? selectedPlace.location.point 
      : selectedPlace.address;
  
    Linking.openURL(`https://maps.google.com/?q=${mapQuery}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom', 'top']} style={{ backgroundColor: '#fff', flex: 1 }}>
        {/* <Header  />  */}
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapViewRef} // Assign the ref here
          style={{ flex: 1 }}
          initialRegion={{
            latitude: (northeastLat + southwestLat) / 2,
            longitude: (northeastLon + southwestLon) / 2,
            latitudeDelta: Math.abs(northeastLat - southwestLat),
            longitudeDelta: Math.abs(northeastLon - southwestLon),
          }}
          onRegionChangeComplete={onRegionChangeComplete}
          // maxZoomLevel={8} // Set max zoom level
          // minZoomLevel={7}  // Set min zoom level
          customMapStyle={mapStyle}
        >

          {/* <Polygon
            coordinates={worldCoordinates}
            holes={[bashkortostanCoordinates]}
            strokeColor="#FFF" // цвет линии
            fillColor="#6699ff40" // цвет заливки
            strokeWidth={0} // толщина линии
          />*/}

          {/* Картинка */}
          {/* <Overlay
            bounds={overlayBounds}
            image={require('../assets/maps/winterMap.png')} // Используем локальное изображение
          />  */}

          {/* Массив точек */}
          {places.map(place => {
            const markerCacheKey = `place-marker-${place.id}`;
            const placeImageCacheKey = `place-image-${place.id}`; 
            // Проверяем, что location существует и имеет значение point
            if (!place.location || !place.location.point) {
              console.error('Некорректные данные места:', place);
              return null;
            }

            const [latitude, longitude] = place.location.point.split(', ').map(Number);
            if (!isNaN(latitude) && !isNaN(longitude)) {


              const markerImageUrl = `https://bashkiriaguide.com/storage/${place.location.img}`; // URL изображения маркера

              return (
                <Marker
                  key={place.id}
                  coordinate={{ latitude, longitude }}
                  title={place.name}
                  // description={place.description}
                  onPress={() => onMarkerPress(place)}
                >
                  <View>
                    <CachedImage
                      source={{ uri: markerImageUrl }}
                      cacheKey={markerCacheKey}
                      style={markerImageStyle2}
                      resizeMode="contain"
                    />
                  </View>
                </Marker>
              );

            } else {
              console.error('Некорректные точка места:', latitude);
              return null;
            }

          })}

        </MapView>
        {selectedPlace && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!selectedPlace}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text>X</Text>
              </TouchableOpacity>
              <CachedImage
                source={{ uri: `https://bashkiriaguide.com/storage/${selectedPlace.img}` }}
                cacheKey={placeImageCacheKey}
                style={styles.imageStyle}
              />
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{selectedPlace.name}</Text>
                <Text style={styles.address}>{selectedPlace.address}</Text>
                <TouchableOpacity style={styles.button} onPress={onDetailsPress}>
                  <Text style={styles.buttonText}>Подробнее</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={openMap}>
                  <Text style={styles.buttonText}>Постороить маршрут</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        )}
      </SafeAreaView>
    </SafeAreaProvider> 
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    height: '33%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  imageStyle: {
    width: '46%',
    height: '100%',
    marginHorizontal: '2%',
    borderRadius: 10,
  },
  infoContainer: {
    width: '50%',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#43B2D9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});


export default BashkortostanMap;
