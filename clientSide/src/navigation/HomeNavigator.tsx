import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProductSearchScreen from '../screens/ProductSearchScreen'
import BottomTab from './BottomTab'
import ProductScreen from '../screens/ProductScreen'
import { Product } from '../screens/ProductSearchScreen'
import BarcodeScanScreen from '../screens/BarcodeScanScreen'
import UploadProductScreen from '../screens/UploadProductScreen'
import  ProductListScreen  from '../screens/ProductListScreen'

export type StackTabParamList = {
    MainScreen:undefined,
    ProductSearchScreen:undefined,
    Home:undefined;
    Scan:undefined;
    Add:undefined;
    Profile:undefined;
    ProductScreen:{
        product:Product,
        productUrl:any
    },
    BarcodeScanScreen:undefined,
    UploadProductScreen:{
        barCode:string | null
    },
    ProductListScreen : { category: string },
}

const homeStack = createNativeStackNavigator<StackTabParamList>()

export default function HomeNavigator(): React.JSX.Element{
    return(
        <homeStack.Navigator initialRouteName='MainScreen'>
            <homeStack.Screen name='MainScreen' component={BottomTab} options={{ headerShown:false }}/>
            <homeStack.Screen name='ProductSearchScreen' component={ProductSearchScreen} options={{ title:'Search' }}/>
            <homeStack.Screen name='ProductScreen' component={ProductScreen} options={{ title:'Product' }}/>
            <homeStack.Screen name='BarcodeScanScreen' component={BarcodeScanScreen}/>
            <homeStack.Screen name='UploadProductScreen'  component={UploadProductScreen}/>
            <homeStack.Screen name='ProductListScreen' component={ProductListScreen} options={{ title:'Product List' }}/>
        </homeStack.Navigator>
    )
}