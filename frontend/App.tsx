import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import BarcodeScan from './screens/BarcodeScan';
import ProductSearch from './screens/ProductSearch';
import AddProduct from './screens/AddProduct';

export type RootStackParamList = {
    Home: undefined;
    BarcodeScan: undefined;
    ProductSearch:undefined;
    AddProduct:undefined;
  };
const Stack = createNativeStackNavigator<RootStackParamList>()

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home' 
        screenOptions={{
            headerStyle:{
                backgroundColor:"#4CAF50",
            },
        }}
        >
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="BarcodeScan" component={BarcodeScan}/>
            <Stack.Screen name="ProductSearch" component={ProductSearch}/>
            <Stack.Screen name="AddProduct" component={AddProduct}/>
        </Stack.Navigator>
    </NavigationContainer>
    
  );
}

export default App;
