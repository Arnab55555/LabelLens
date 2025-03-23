import React from 'react'
import { View,Text,SafeAreaView,StyleSheet} from 'react-native'
export default function AddScreen(): React.JSX.Element{
  return(
    <SafeAreaView style={styles.container}>
      <Text>Addscreen</Text>
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