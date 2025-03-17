
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackTabParamList } from '../navigation/HomeNavigator';
import { SearchBar } from '@rneui/themed';
import axios from 'axios';
import { Card, Image } from '@rneui/base';

type SearchFocusScreenProp = NativeStackScreenProps<StackTabParamList, 'SearchFocusScreen'>;

export type Product = {
  _id: string;
  code: number;
  url?: string;
  product_name?: string;
  generic_name?: string;
  quantity?: string;
  brands?: string;
  categories?: string;
  ingredients_text?: string;
  ingredients_analysis_tags?: string;
  allergens?: string;
  traces?: string;
  additives_n?: number;
  additives_en?: string;
  pnns_groups_1?: string;
  pnns_groups_2?: string;
  product_quantity?: number;
  main_category_en?: string;
  image_url?: string;
  image_small_url?: string;
  image_ingredients_url?: string;
  image_ingredients_small_url?: string;
  image_nutrition_url?: string;
  image_nutrition_small_url?: string;
  energy_kcal_100g?: number;
  energy_100g?: number;
  energy_from_fat_100g?: number;
  fat_100g?: number;
  saturated_fat_100g?: number;
  butyric_acid_100g?: number;
  caproic_acid_100g?: number;
  caprylic_acid_100g?: number;
  capric_acid_100g?: number;
  lauric_acid_100g?: number;
  myristic_acid_100g?: number;
  palmitic_acid_100g?: number;
  stearic_acid_100g?: number;
  arachidic_acid_100g?: number;
  behenic_acid_100g?: number;
  lignoceric_acid_100g?: number;
  cerotic_acid_100g?: number;
  montanic_acid_100g?: number;
  melissic_acid_100g?: number;
  unsaturated_fat_100g?: number;
  monounsaturated_fat_100g?: number;
  omega_9_fat_100g?: number;
  polyunsaturated_fat_100g?: number;
  omega_3_fat_100g?: number;
  omega_6_fat_100g?: number;
  alpha_linolenic_acid_100g?: number;
  eicosapentaenoic_acid_100g?: number;
  docosahexaenoic_acid_100g?: number;
  linoleic_acid_100g?: number;
  arachidonic_acid_100g?: number;
  gamma_linolenic_acid_100g?: number;
  dihomo_gamma_linolenic_acid_100g?: number;
  oleic_acid_100g?: number;
  elaidic_acid_100g?: number;
  gondoic_acid_100g?: number;
  mead_acid_100g?: number;
  erucic_acid_100g?: number;
  nervonic_acid_100g?: number;
  trans_fat_100g?: number;
  cholesterol_100g?: number;
  carbohydrates_100g?: number;
  sugars_100g?: number;
  added_sugars_100g?: number;
  sucrose_100g?: number;
  glucose_100g?: number;
  fructose_100g?: number;
  lactose_100g?: number;
  maltose_100g?: number;
  maltodextrins_100g?: number;
  starch_100g?: number;
  polyols_100g?: number;
  erythritol_100g?: number;
  fiber_100g?: number;
  soluble_fiber_100g?: number;
  insoluble_fiber_100g?: number;
  proteins_100g?: number;
  casein_100g?: number;
  serum_proteins_100g?: number;
  nucleotides_100g?: number;
  salt_100g?: number;
  added_salt_100g?: number;
  sodium_100g?: number;
  alcohol_100g?: number;
  vitamin_a_100g?: number;
  beta_carotene_100g?: number;
  vitamin_d_100g?: number;
  vitamin_e_100g?: number;
  vitamin_k_100g?: number;
  vitamin_c_100g?: number;
  vitamin_b1_100g?: number;
  vitamin_b2_100g?: number;
  vitamin_pp_100g?: number;
  vitamin_b6_100g?: number;
  vitamin_b9_100g?: number;
  folates_100g?: number;
  vitamin_b12_100g?: number;
  biotin_100g?: number;
  pantothenic_acid_100g?: number;
  silica_100g?: number;
  bicarbonate_100g?: number;
  potassium_100g?: number;
  chloride_100g?: number;
  calcium_100g?: number;
  phosphorus_100g?: number;
  iron_100g?: number;
  magnesium_100g?: number;
  zinc_100g?: number;
  copper_100g?: number;
  manganese_100g?: number;
  fluoride_100g?: number;
  selenium_100g?: number;
  chromium_100g?: number;
  molybdenum_100g?: number;
  iodine_100g?: number;
  caffeine_100g?: number;
  taurine_100g?: number;
  ph_100g?: number;
  fruits_vegetables_nuts_100g?: number;
  fruits_vegetables_nuts_dried_100g?: number;
  fruits_vegetables_nuts_estimate_100g?: number;
  fruits_vegetables_nuts_estimate_from_ingredients_100g?: number;
  collagen_meat_protein_ratio_100g?: number;
  cocoa_100g?: number;
  chlorophyl_100g?: number;
  carbon_footprint_100g?: number;
  carbon_footprint_from_meat_or_fish_100g?: number;
  glycemic_index_100g?: number;
  water_hardness_100g?: number;
  choline_100g?: number;
  phylloquinone_100g?: number;
  beta_glucan_100g?: number;
  inositol_100g?: number;
  carnitine_100g?: number;
  sulphate_100g?: number;
  nitrate_100g?: number;
  acidity_100g?: number;
  category?: string;
  HealthStarRating?: any;
  HSRTotalPoints?: any;
  nutriscore_score_final?: any;
  nutriscore_grade_final?: string;
};

export default function SearchFocusScreen({ navigation }: SearchFocusScreenProp): React.JSX.Element {

  const [search, setSearch] = useState<string>('');
  const [productList,setProductList] = useState<Product[] | null>(null);
  const productListRef = useRef<Product[] | null>(null);

  useLayoutEffect(()=>{
    const fetchProducts = async()=>{
      try{
        const response = await axios.get('http://192.168.0.100:3000/api/product/search')
        productListRef.current = response.data
      }catch(error){
        if(error instanceof Error)
          console.error("Error Occured",error.message)
        else
          console.error("Error Occured",error)
      }
    }
    
    if(!productListRef.current){
      fetchProducts()
    }
  })

  const handleChangeText=(text:string)=>{
    setSearch(text)
    let filteredProduct
    if(text.trim()==='')
      setProductList(null)
    else if(productListRef.current){
      filteredProduct = productListRef.current.filter((product)=>product.product_name?.toLowerCase().includes(text.toLowerCase()))
      setProductList(filteredProduct)
    }
  }

  const handleProductPress=(item:Product,productUrl:string)=>{
    navigation.navigate('ProductScreen',{
      product:item,
      productUrl:productUrl
    })
  }

  const handleSubmit = ()=>{

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
              return(
                <TouchableOpacity onPress={()=>handleProductPress(item,productUrl)}>
                <Card containerStyle={styles.cardContainer} wrapperStyle={styles.cardWrapper}>
                    <Image 
                      style={styles.imageContainer}
                      source={productUrl} 
                      resizeMode="contain" 
                    />
                    <Text>{item.product_name}</Text>
                </Card>
                </TouchableOpacity>
              )
            }
            }
          />
    </SafeAreaView>
  );
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
  imageContainer:{
    width:30,
    height:30,
    marginRight:10,
  },
  cardContainer:{
    borderRadius:10,
    elevation:0,
    margin:0,
    padding:12
  },
  cardWrapper:{
    flexDirection:'row',
    alignItems:'center',
  }
});
