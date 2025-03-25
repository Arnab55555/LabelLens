import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity} from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {StackTabParamList} from '../navigation/HomeNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Image} from '@rneui/themed';
import {Product} from './ProductSearchScreen';
import axios from 'axios';
type BarcodeScanScreenProps = NativeStackScreenProps<
  StackTabParamList,
  'BarcodeScanScreen'
>;
export default function BarcodeScanScreen({
  navigation,
}: BarcodeScanScreenProps): React.JSX.Element {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const [scanned, setScanned] = useState<boolean>(false);
  const [barCode, setBarCode] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCameraActive, setIsCameraActive] = useState(true);
  
  console.log('Barcode Scanner is opened');

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(
        `http://10.0.7.170:3000/api/product/${barCode}`,
      );
      console.log(response.data)
      setProduct(response.data);
      setIsLoading((prev)=>false)
    };
    fetchProduct();
  }, [barCode]);
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      if (!scanned && codes.length > 0 && codes[0]?.value) {
        setScanned(true);
        setBarCode(codes[0].value);
      }
    },
  });
  if (!hasPermission) {
    return (
      <View>
        <Text>You Need To Give Permission To Use Barcode Scanner</Text>
      </View>
    );
  }
  if (device == null) {
    return (
      <View>
        <Text>Device Not Found</Text>
      </View>
    );
  }
  
  const handleOnPress = ()=>{
    setIsCameraActive(false); 
    navigation.navigate('UploadProductScreen',{barCode: barCode})
  }
  return (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        codeScanner={codeScanner}
      />
      {product &&
        (() => {
            const imageUrl =
            product.image_url ?? product.image_ingredients_url ?? product.image_nutrition_url;
            const productUrl = imageUrl ? {uri: imageUrl} : require('../assets/images/Image_Not_Available.jpg');
        
          const NutriScore = product.nutriscore_grade_final as 'a' | 'b' | 'c' | 'd' | 'e';
          const nutriScoreImages = {
            a: require('../assets/images/Nutriscore_Icons/Nutri-score-A.png'),
            b: require('../assets/images/Nutriscore_Icons/Nutri-score-B.png'),
            c: require('../assets/images/Nutriscore_Icons/Nutri-score-C.png'),
            d: require('../assets/images/Nutriscore_Icons/Nutri-score-D.png'),
            e: require('../assets/images/Nutriscore_Icons/Nutri-score-E.png'),
          };
          
          const NutriScoreImageUrl = NutriScore ? nutriScoreImages[NutriScore] : null;
          return (
            <Card containerStyle={{ backgroundColor:'transparent', borderWidth:0, padding:0,flex:1,elevation:0, justifyContent:'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                setIsCameraActive(false); 
                navigation.push('ProductScreen', {
                product: product,
                productUrl: { uri: product.image_url },
              })}}
            >
            <Card
              containerStyle={{margin:0,borderRadius: 10, elevation: 0, marginBottom:10}}
              wrapperStyle={{flexDirection:'row'}}>
              <Card
                containerStyle={{
                  margin: 0,
                  borderRadius: 10,
                  elevation: 0,
                  padding: 5,
                  width: '50%',
                }}
                wrapperStyle={{padding: 0}}>
                <Image
                  style={{width: '100%', height: 150}}
                  source={productUrl}
                  resizeMode="contain"
                />
              </Card>
              <Card
                containerStyle={{
                  margin: 0,
                  width: '50%',
                  borderRadius: 10,
                  elevation: 0,
                  borderWidth: 0,
                  alignItems: 'center',
                }}
                wrapperStyle={{
                  flex: 1,
                  justifyContent: 'space-between',
                  paddingLeft: 15,
                }}>
                <Text>{product.product_name}</Text>
                <Image
                  style={{width: '100%', height: 66}}
                  source={NutriScoreImageUrl}
                  resizeMode="contain"
                />
              </Card>
            </Card>
            </TouchableOpacity>
            </Card>
          );
        })()}
        {barCode && !product && !isLoading && (()=>{
          const productUrl = require('../assets/images/Image_Not_Available.jpg')
          return (
            <Card containerStyle={{ backgroundColor:'transparent', borderWidth:0, padding:0,flex:1,elevation:0, justifyContent:'flex-end'}}>
            <Card
              containerStyle={{margin:0,borderRadius: 10, elevation: 0, marginBottom:10}}
              wrapperStyle={{flexDirection:'row'}}>
              <Card
                containerStyle={{
                  margin: 0,
                  borderRadius: 10,
                  elevation: 0,
                  padding: 5,
                  width: '50%',
                }}
                wrapperStyle={{padding: 0}}>
                <Image
                  style={{width: '100%', height: 150}}
                  source={productUrl}
                  resizeMode="contain"
                />
              </Card>
              <Card
                containerStyle={{
                  margin: 0,
                  width: '50%',
                  borderRadius: 10,
                  elevation: 0,
                  borderWidth: 0,
                  alignItems: 'center',
                }}
                wrapperStyle={{
                  flex: 1,
                  justifyContent: 'space-between',
                  paddingLeft: 15,
                }}>
                <Text>Product Not Found</Text>
                <Button 
                  size="lg"
                  onPress={handleOnPress}
                >Upload Product</Button>
              </Card>
            </Card>
            </Card>
          );
        })()}
    </>
  );
}
