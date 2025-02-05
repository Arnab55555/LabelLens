import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type HomeProps=NativeStackScreenProps<RootStackParamList,'Home'>
const Home = ({ navigation }: HomeProps) => {

  return (
    <SafeAreaView style = {styles.container}>
    <Text style = {styles.headerText}>📋🔍 LabelLens </Text>
    
    <TouchableOpacity style = {styles.card} onPress={()=>navigation.navigate("ProductSearch")}>
        <Text style = {styles.cardText}>🔍   Search for a product</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style = {styles.card} onPress={()=>navigation.navigate("AddProduct")}>
        <Text style = {styles.cardText}>📋   Add Product Details</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style = {styles.photoButton} onPress={()=>navigation.navigate("BarcodeScan")}>
        <Text style = {styles.photoButtonText}> 📷   Take a Photo of the Label </Text>
    </TouchableOpacity>

    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      paddingHorizontal: 20,
  },
  headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
      color: '#4CAF50',
  },
  card: {
      width: '100%',
      backgroundColor: '#F8F8F8',
      borderRadius: 10,
      elevation: 3,
      padding: 15,
      marginVertical: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.1,
      shadowRadius: 4,
  },
  cardText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000000',
  },
  photoButton: {
      width: '100%',
      backgroundColor: '#4CAF50',
      borderRadius: 10,
      padding: 15,
      marginTop: 100,
      alignItems: 'center',
  },
  photoButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
  },
  
  });
  
export default Home