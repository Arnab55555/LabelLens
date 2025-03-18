import React, { use, useRef, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackTabParamList } from '../navigation/HomeNavigator'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Product } from './SearchFocusScreen'
import { Card, SearchBar } from '@rneui/base'
type ProductListScreenProps = NativeStackScreenProps<StackTabParamList, 'ProductListScreen'>
function ProductListScreen({ navigation, route }: ProductListScreenProps) {
  const { searchText, productsRef, products } = route.params

  const [search, setSearch] = useState<string>(searchText);
  const [productList,setProductList] = useState<Product[] | null>(products);
  const productListRef = useRef<Product[] | null>(productsRef);

  const handleChangeText=(text:string)=>{
    setSearch(text)
  }

  const handleProductPress=(item:Product,productUrl:any)=>{
      navigation.navigate('ProductScreen',{
        product:item,
        productUrl:productUrl
      })
    }
  
  const handleSubmit = ()=>{
    let filteredProduct
    if(search.trim()==='')
      setProductList(null)
    else if(productListRef.current){
      filteredProduct = productListRef.current.filter((product)=>product.product_name?.toLowerCase().includes(search.toLowerCase()))
      setProductList(filteredProduct)
    }
  }
  
  return (
    <SafeAreaView style={styles.container}>
          <SearchBar
            autoFocus={true}
            placeholder='Search for Packaged Food'
            platform='android'
            cancelIcon={false}
            searchIcon={false}
            onChangeText={handleChangeText}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInput}
            value={search}
            onSubmitEditing={handleSubmit}
          />
          <FlatList
            data={productList} 
            keyExtractor={product=>product._id}
            keyboardShouldPersistTaps="handled"
            renderItem={({item})=>{
              const imageUrl = item.image_url ?? item.image_ingredients_url ?? item.image_nutrition_url
              const productUrl = imageUrl ? { uri:imageUrl } : require('../assets/images/Image_Not_Available.jpg')


              const NutriScore = item.nutriscore_grade_final as 'a' | 'b' | 'c' | 'd' | 'e';
              const nutriScoreImages = {
                a: require('../assets/images/Nutriscore_Icons/Nutri-score-A.png'),
                b: require('../assets/images/Nutriscore_Icons/Nutri-score-B.png'),
                c: require('../assets/images/Nutriscore_Icons/Nutri-score-C.png'),
                d: require('../assets/images/Nutriscore_Icons/Nutri-score-D.png'),
                e: require('../assets/images/Nutriscore_Icons/Nutri-score-E.png'),
              }
              const NutriScoreImageUrl = NutriScore ? nutriScoreImages[NutriScore] : null

              return(
                <TouchableOpacity onPress={()=>handleProductPress(item,productUrl)}>
                  <Card containerStyle={styles.mainCardContainer}>
                    <View style={styles.productViewWrapper}>
                      <Card containerStyle={styles.imageCardContainer}>
                        <Image
                          style={styles.ProductImage}
                          source={productUrl}
                          resizeMode='contain'
                        />
                      </Card>
                      <View style={styles.productDetailsContainer}>
                      <Text>{item.product_name}</Text>
                        <Image
                          style={styles.NutriscoreImageContainer}
                          source={NutriScoreImageUrl}
                          resizeMode='contain'
                        />
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              )
            }}
          />
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  searchBarContainer: {
    backgroundColor:'#f0f0f0',
    borderRadius:10,
  },
  searchBarInput: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  NutriscoreImageContainer:{
    width:100,
    height:66,
  },
  ProductImage: {
    width: '100%',
    height: '100%',
  },
  mainCardContainer: {
    margin:0,
    marginTop:10,
    borderRadius: 10,
    elevation: 0,
  },
  productViewWrapper: {
    margin:0,
    padding:0,
    flex: 1,
    flexDirection: 'row',
  },
  imageCardContainer: {
    margin:0,
    marginRight: 10,
    width: '50%',
    minHeight:160,
    borderRadius: 10,
    padding: 5,
    elevation: 0,
  },
  productDetailsContainer: {
    padding:5,
    width: '48%',
    justifyContent:'space-between'
  },
});


export default ProductListScreen