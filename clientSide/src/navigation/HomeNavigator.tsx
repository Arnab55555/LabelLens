import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SearchFocusScreen from '../screens/SearchFocusScreen'
import BottomTab from './BottomTab'
import ProductScreen from '../screens/ProductScreen'
import { Product } from '../screens/SearchFocusScreen'

export type StackTabParamList = {
    MainScreen:undefined,
    SearchFocusScreen:undefined,
    Home:undefined;
    Scan:undefined;
    Add:undefined;
    Profile:undefined;
    ProductScreen:{
        product:Product,
        productUrl:any
    };
    ProductListScreen:{
        search:String
    }
}

const homeStack = createNativeStackNavigator<StackTabParamList>()

export default function HomeNavigator(): React.JSX.Element{
    return(
        <homeStack.Navigator initialRouteName='MainScreen'>
            <homeStack.Screen name='MainScreen' component={BottomTab} options={{ headerShown:false }}/>
            <homeStack.Screen name='SearchFocusScreen' component={SearchFocusScreen} options={{ title:'Search' }}/>
            <homeStack.Screen name='ProductScreen' component={ProductScreen} options={{ title:'Product' }}/>
        </homeStack.Navigator>
    )
}