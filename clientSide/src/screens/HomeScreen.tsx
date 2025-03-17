import React, { useState } from 'react'
import { View,Text,SafeAreaView,StyleSheet, ScrollView, FlatList} from 'react-native'
import { SearchBar } from '@rneui/themed';
import { Card } from '@rneui/themed';
import { Image } from '@rneui/base';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackTabParamList } from '../navigation/HomeNavigator';
type HomescreenProps = NativeStackScreenProps<StackTabParamList,'Home'>

export default function HomeScreen({navigation}:HomescreenProps): React.JSX.Element{
    const tabBarHeight = useBottomTabBarHeight()
    const [search,setSearch] = useState("")
    const categories = [
      {
        id:'1',
        categoryTitle:'Beverages',
        imageUri:require('../assets/images/Beverages.jpg')
      },
      {
        id:'2',
        categoryTitle:'Water',
        imageUri:require('../assets/images/Water.jpg')
      },
      {
        id:'3',
        categoryTitle:'Cheese',
        imageUri:require('../assets/images/Cheese.jpg')
      },
      {
        id:'4',
        categoryTitle:'Dairy',
        imageUri:require('../assets/images/Dairy.jpg')
      },
      {
        id:'5',
        categoryTitle:'Fat/Nuts/Oil/Seeds',
        imageUri:require('../assets/images/Fat_Nuts_Oil_Seeds.jpg')
      },
      {
        id:'6',
        categoryTitle:'General Food',
        imageUri:require('../assets/images/General_Food.jpg')
      },
      
    ]

    const searchFocus=()=>{
      navigation.navigate('SearchFocusScreen')
    }
    const updateSearch = (text:string)=>{ setSearch(text) }
  return(
    <SafeAreaView style={styles.container}>
            <FlatList 
              data={categories}
              keyExtractor={category=>category.id}
              horizontal={false}
              numColumns={2}
              ListHeaderComponent={()=>(
                <SearchBar
                  placeholder='Search for Packaged Food'
                  onChangeText={ updateSearch }
                  value={search}
                  containerStyle={ styles.searchBarContainer }
                  inputContainerStyle={ styles.searchBarInput }
                  platform='android'
                  onFocus={searchFocus}
                />
              )}
              renderItem={ ({item})=>
              (                                                                                   
                <Card
                  containerStyle={styles.cardContainerStyle}
                  wrapperStyle={styles.cardWrapperStyle}
                >
                  <Image
                    style={styles.Imagestyle}
                    source={ item.imageUri }
                    resizeMode="contain"
                  />
                  <Card.Divider/>
                  <Card.Title>{item.categoryTitle}</Card.Title>
                </Card>
              ) }
            />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    marginLeft:10,
    marginRight:10
  },
  searchBarContainer:{
    borderRadius:10, 
    backgroundColor:'#f0f0f0'
  },
  searchBarInput:{
    padding:2,
    borderRadius:10, 
    backgroundColor:'white'
  },
  Imagestyle:{
    height:150,
    width:'100%',
  },
  cardContainerStyle:{
    borderRadius:10,
    margin:0,
    width:'50%',
    backgroundColor:'white',
    elevation:0
  },
  cardWrapperStyle:{
    width:'100%',
    borderRadius:10,
  }
})