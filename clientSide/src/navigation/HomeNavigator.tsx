import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SearchFocusScreen from '../screens/SearchFocusScreen'
import BottomTab from './BottomTab'
import ProductScreen from '../screens/ProductScreen'
import { Product } from '../screens/SearchFocusScreen'
import ProductListScreen from '../screens/ProductListScreen'

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
    },
    ProductListScreen:{
        searchText:string,
        productsRef:Product[]  | null
        products:Product[] | null
    }
}

const homeStack = createNativeStackNavigator<StackTabParamList>()

export default function HomeNavigator(): React.JSX.Element{
    return(
        <homeStack.Navigator initialRouteName='MainScreen'>
            <homeStack.Screen name='MainScreen' component={BottomTab} options={{ headerShown:false }}/>
            <homeStack.Screen name='SearchFocusScreen' component={SearchFocusScreen} options={{ title:'Search' }}/>
            <homeStack.Screen name='ProductScreen' component={ProductScreen} options={{ title:'Product' }}/>
            <homeStack.Screen name='ProductListScreen' component={ProductListScreen} options={{title:'Products'}} />
        </homeStack.Navigator>
    )
}