import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type BarcodeScanProps=NativeStackScreenProps<RootStackParamList,'BarcodeScan'>
const BarcodeScan = ({navigation}:BarcodeScanProps) => {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const [scanned, setScanned] = useState(false);
  console.log("Barcode Scanner is opened")
  React.useEffect(()=>{
    requestPermission();
  },[]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes:Code[]) => { 
      if (!scanned && codes.length > 0 && codes[0]?.value) {
        setScanned(true);
        console.log("Barcode Scanned: ", codes[0].value);
        navigation.navigate("ProductScreen", { ProductId: codes[0].value });
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
