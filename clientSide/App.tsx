import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import BottomTab from './src/navigation/BottomTab'
import HomeNavigator from './src/navigation/HomeNavigator'

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <HomeNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
