import React from 'react'
import { View,Text,SafeAreaView,StyleSheet} from 'react-native'

export default function ProfileScreen(): React.JSX.Element{
  return(
    <SafeAreaView style={styles.container}>
      <Text>Profilescreen</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ffffff"
  }
})