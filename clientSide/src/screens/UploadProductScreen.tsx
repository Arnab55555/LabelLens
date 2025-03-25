import React, { useState } from 'react';
import { View, Image, Alert, StyleSheet, Text, PermissionsAndroid, Platform, ActivityIndicator, SafeAreaView } from 'react-native';
import { Button } from '@rneui/themed';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import axios from 'axios';
import { StackTabParamList } from '../navigation/HomeNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type UploadProductScreenProps = NativeStackScreenProps<StackTabParamList,'UploadProductScreen'>
export default function UploadProductScreen({navigation,route}:UploadProductScreenProps) {
  const [frontImageUri, setFrontImageUri] = useState<string | null>(null);
  const [nutritionImageUri, setNutritionImageUri] = useState<string | null>(null);
  const [ingredientsImageUri, setIngredientsImageUri] = useState<string | null>(null);
  const [barCode, setBarCode] = useState<string | null>(route.params.barCode)
  const [loading, setLoading] = useState<boolean>(false);

  // Request Camera Permission
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Capture/Upload Image
  const captureImage = async (setImageUri: React.Dispatch<React.SetStateAction<string | null>>) => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Error', 'Camera permission is required');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled image capture');
      } else if (response.errorMessage) {
        Alert.alert('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        console.log("uri : "+uri)
        if (uri) setImageUri(uri);
      }

      // Ensure camera session is released
      response?.assets?.forEach(() => null);
      if (response.errorCode === 'camera_unavailable') {
        Alert.alert('Error', 'Camera is already in use. Please close other applications using the camera.');
      }
    });
  };

  // Upload Images to Backend
  const uploadImages = async () => {
    if (!frontImageUri || !nutritionImageUri || !ingredientsImageUri) {
      Alert.alert('Error', 'Please capture all images before uploading');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('frontImage', {
      uri: frontImageUri,
      name: 'front_image.jpg',
      type: 'image/jpeg',
    });
    formData.append('nutritionImage', {
      uri: nutritionImageUri,
      name: 'nutrition_image.jpg',
      type: 'image/jpeg',
    });
    formData.append('ingredientsImage', {
      uri: ingredientsImageUri,
      name: 'ingredients_image.jpg',
      type: 'image/jpeg',
    });
    formData.append('barCode', Number(barCode));

    try {
      const response = await axios.post('http://192.168.0.100:3000/api/product/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Product data saved successfully!');
      console.log(response.data);
      // Reset image states after successful upload
      setFrontImageUri(null);
      setNutritionImageUri(null);
      setIngredientsImageUri(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to upload images');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Front Page of Product</Text>
        <Text style={styles.cardDescription}>Ensure the image is clear of front page</Text>
        <View style={styles.row}>
          {frontImageUri && (
            <Image source={{ uri: frontImageUri }} style={styles.smallImage} />
          )}
          {!frontImageUri && (
            <Image source={require('../assets/images/Image_Not_Available.jpg')} style={styles.smallImage} />
          )}
          <Button buttonStyle={{borderRadius:5}} title="Capture" onPress={() => captureImage(setFrontImageUri)} color="#4CAF50" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nutrition Information</Text>
        <Text style={styles.cardDescription}>Ensure the image is clear and readable</Text>
        <View style={styles.row}>
          {nutritionImageUri && (
            <Image source={{ uri: nutritionImageUri }} style={styles.smallImage} />
          )}
          {!nutritionImageUri && (
            <Image source={require('../assets/images/Image_Not_Available.jpg')} style={styles.smallImage} />
          )}
          <Button buttonStyle={{borderRadius:5}} title="Capture" onPress={() => captureImage(setNutritionImageUri)} color="#4CAF50" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ingredients List</Text>
        <Text style={styles.cardDescription}>Ensure all ingredients are visible</Text>
        <View style={styles.row}>
          {ingredientsImageUri && (
            <Image source={{ uri: ingredientsImageUri }} style={styles.smallImage} />
          )}
          {!ingredientsImageUri && (
            <Image source={require('../assets/images/Image_Not_Available.jpg')} style={styles.smallImage} />
          )}
          <Button buttonStyle={{borderRadius:5}} title="Capture" onPress={() => captureImage(setIngredientsImageUri)} color="#4CAF50" />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <Button buttonStyle={{marginTop:10, marginBottom:10, borderRadius:10, width:200}} size='lg' title="Upload Images" onPress={uploadImages} color="green" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin:0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    // backgroundColor: '#F5F5F5',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 10,
    borderWidth:1,
    borderColor:'#ddd',
    elevation: 0,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderRadius: 8,
  },
});
