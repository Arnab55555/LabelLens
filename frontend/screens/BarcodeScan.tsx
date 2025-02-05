import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'

const BarcodeScan = () => {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  console.log("Barcode Scanner is opened")
  React.useEffect(()=>{
    requestPermission();
  },[]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes:Code[]) => { 
      console.log("Barcode scanned event triggered!", codes);
      if (codes.length > 0) {
        console.log(`Scanned ${codes[0].value} codes!`);
      }
    }
  })
  if (!hasPermission){
    return(
      <View>
        <Text>You Need To Give Permission To Use Barcode Scanner</Text>
      </View>
    )
  }
  if (device == null){
    return(
      <View>
        <Text>Device Not Found</Text>
      </View>
    )
  }
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  )
}

export default BarcodeScan
