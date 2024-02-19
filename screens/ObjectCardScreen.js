// ObjectCardScreen.js
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Linking, FlatList, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Make sure to import useNavigation
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import Header from '../components/Header'; // Assuming you have a custom Header component
import CrossLoadingScreen from './CrossLoadingScreen';

const ObjectCardScreen = ({ route }) => {
  const { placeId } = route.params;
  const [placeDetails, setPlaceDetails] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const openBookingModal = () => {
    setIsModalVisible(true);
  };

  const OrganizationItem = ({ name, phones, link }) => {
    // Parse the phones JSON string into an array
    const phoneNumbers = JSON.parse(phones);
    
    const handlePhonePress = (phoneNumber) => {
      // Use the Linking API to make a call
      Linking.openURL(`tel:${phoneNumber}`);
    };

    return (
      <View style={styles.organizationItem}>
        <Text style={styles.organizationName}>{name}</Text>
        {phoneNumbers.map((phone, index) => (
          <TouchableOpacity key={index} onPress={() => handlePhonePress(phone)}>
            <Text style={styles.organizationPhone}>{phone}</Text>
          </TouchableOpacity>
        ))}
        {link && (
          <TouchableOpacity onPress={() => Linking.openURL(link)} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Посетить веб-сайт</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  

  // Get the header height dynamically
  const onHeaderLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true, // This hides the header
    });
  }, [navigation]);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await fetch(`https://bashkiriaguide.com/api/places/${placeId}`);
        const json = await response.json();
        setPlaceDetails(json.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  if (!placeDetails) {
    return <CrossLoadingScreen />;
  }

  const openMap = () => {
    // Check if location is available, if so use the point, otherwise use the address
    const mapQuery = placeDetails.location ? placeDetails.location.point : placeDetails.address;
    Linking.openURL(`https://maps.google.com/?q=${mapQuery}`);
  };

  const ReviewItem = ({ review }) => {
    const readableDate = new Date(review.created_at).toLocaleDateString();
    return (
      <View style={styles.reviewItem}>
        <Text style={styles.reviewText}>{review.text}</Text>
        <Text style={styles.reviewDate}>{readableDate}</Text>
      </View>
    );
  };
  

  return (    
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom', 'top']} style={{ backgroundColor: '#fff', flex: 1 }}>
        {/* <Header onLayout={onHeaderLayout} /> */}
        <ScrollView >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `https://bashkiriaguide.com/storage/${placeDetails.img}` }}
              style={styles.image}
            />
            <TouchableOpacity onPress={openBookingModal} style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Забронировать поездку</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{placeDetails.name}</Text>
            <Text style={styles.description}>{placeDetails.description}</Text>

            <View style={styles.bottomContainer}>
              <View style={styles.addressContainer}>
                <Image
                  source={require('../assets/img/mapIcon.png')}
                  style={styles.imageIcon}
                />
                <Text style={styles.address}>{placeDetails.address}</Text>
              </View>
              <TouchableOpacity onPress={openMap} style={styles.mapButton}>
                <Text style={styles.mapButtonText}>Показать на карте</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', marginTop: 30}}>
              <Text style={styles.title}>Отзывы</Text>
              <TouchableOpacity onPress={openBookingModal} style={styles.reviewButton}>
                <Text style={styles.bookButtonText}>Оставить отзыв</Text>
              </TouchableOpacity>   
            </View>
            {placeDetails.reviews && placeDetails.reviews.length > 0 ? (
              <FlatList
                data={placeDetails.reviews}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ReviewItem review={item} />}
              />
            ) : (
              <Text style={styles.noReviewsText}>Отзывы отсутствуют</Text>
            )}
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isModalVisible}
          onRequestClose={() => {
            setIsModalVisible(!isModalVisible);
          }}
        >
          <View style={styles.modalView}>
            <FlatList
              data={placeDetails.organisations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <OrganizationItem name={item.name} phones={item.phones} link={item.link} />
              )}
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Align items in the center vertically
    flex: 1, // Allow this container to fill the available space
    paddingRight: 10, // Add some padding to the right if needed
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // image: {
  //   width: '96%',
  //   aspectRatio: 1, // Depending on your aspect ratio
  //   margin: 'auto',
  // },
  imageContainer: {
    position: 'relative', // This makes it a reference for absolute positioning
  },
  image: {
    width: '100%', // Make the image take up the full container width
    height: 400, // Adjust this as needed
  },
  bookButton: {
    position: 'absolute', // Position the button absolutely
    bottom: 10, // Position it 10 points from the bottom
    left: 105, // Center the button by setting left to 50%
    transform: [{ translateX: -100 }], // Adjust the horizontal position by half of the button's width
    backgroundColor: '#373571', // Use your own color
    padding: 15,
    borderRadius: 5,
    zIndex: 10, // Make sure the button is above the image
  },
  reviewButton: {
    backgroundColor: '#373571', // Use your own color
    padding: 10,
    borderRadius: 5,
  },
  bookButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageIcon: {
    width: 16,
    height: 16,
  },
  detailsContainer: {
    position: 'relative',
    width: '96%',
    marginHorizontal: '2%',
    paddingVertical: 20,
    // marginTop: 100,
    fontFamily: 'Inter',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#373571',
    fontFamily: 'Inter',

  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Inter',

  },
  address: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Inter',
    flex: 1, // Allow text to wrap and fill the available space
    paddingLeft: 10,
    flexWrap: 'wrap', // This will wrap the text onto the next line
  },
  mapButton: {
    backgroundColor: '#373571', // Use your own color
    padding: 10,
    borderRadius: 5,
  },
  mapButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter',

  },
  organizationItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  organizationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  organizationPhone: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  linkButton: {
    marginTop: 10,
    backgroundColor: '#373571',
    padding: 10,
    borderRadius: 5,
  },
  linkButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  
  closeModalButton: {
    backgroundColor: '#373571', // Use your own color
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
  },
  reviewItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  
  reviewText: {
    fontSize: 16,
    color: 'black',
    // Дополнительные стили для текста отзыва
  },
  
  noReviewsText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 20,
  },
  reviewDate: {
    fontSize: 14,
    color: 'grey',
    marginTop: 5,
    // Дополнительные стили для текста даты
  },
  // Additional styles if needed
});


export default ObjectCardScreen;
