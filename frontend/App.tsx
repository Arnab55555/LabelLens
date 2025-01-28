import { ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Homepage from './templates/Homepage'


// const Stack = createStackNavigator();

const App = () => {
  return (
    < Homepage />
  )
}

export default App

const styles = StyleSheet.create({
  whiteText: {
    color: '#FFFFFF'
  },
  
})