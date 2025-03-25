import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {StackTabParamList} from '../navigation/HomeNavigator';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Card, Image, Button} from '@rneui/themed';

type ScanScreenProps = NativeStackScreenProps<StackTabParamList, 'Add'>;

export default function AddScreen({
  navigation,
}: ScanScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={{flex: 1, marginLeft: 10, marginRight: 10}}>
      <Card
        containerStyle={{ borderRadius: 10, elevation: 0, marginLeft: 0, marginRight: 0 }}
      >
        <Image
          style={{width: '100%', height: 200}}
          source={require('../assets/images/scan_barcode.jpg')}
          resizeMode="contain"
        />
        <View style={{alignItems: 'center'}}>
          <Button
            buttonStyle={{borderRadius: 10}}
            containerStyle={{width: '70%'}}
            size="lg"
            onPress={()=>navigation.navigate('BarcodeScanScreen')}
          >
            Add
          </Button>
        </View>
      </Card>

      <Text style={{fontSize: 20, fontWeight: '500', margin: 10}}>
        Added Product History
      </Text>

      <Card containerStyle={{ margin:0, borderRadius:10, elevation:0}} wrapperStyle={{ flexDirection:'row' }}>
          <Card containerStyle={{ margin:0,borderRadius:10, elevation:0, padding:5,width:'50%'}} wrapperStyle={{padding:0}}>
            <Image
              style={{ width:'100%', height:150}}
              source={require('../assets/images/Image_Not_Available.jpg')}
              resizeMode='contain'
            />
          </Card>
          <Card containerStyle={{ margin:0, width:'50%', borderRadius:10,elevation:0, borderWidth:0, alignItems:'center'}} 
            wrapperStyle={{ flex:1,justifyContent:'space-between',paddingLeft:15}}
          >
            <Text>Product Name</Text>
            <Image 
              style={{ width:'100%', height:66 }}
              source={require('../assets/images/Nutriscore_Icons/Nutri-score-B.png')}
              resizeMode='contain'
            />
          </Card>
      </Card>
    </SafeAreaView>
  );
}
