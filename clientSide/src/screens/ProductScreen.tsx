import React, { useState } from 'react'
import { Text, SafeAreaView, StyleSheet, ScrollView, View, FlatList, TouchableOpacity } from 'react-native'
import { StackTabParamList } from '../navigation/HomeNavigator'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Card, Image } from '@rneui/base'
import axios from 'axios'
import { useEffect } from 'react'
import { Product } from './ProductSearchScreen'


type ProductScreenProps = NativeStackScreenProps<StackTabParamList, 'ProductScreen'>

export default function ProductScreen({ navigation, route }: ProductScreenProps) {
  const { product, productUrl } = route.params
  const [betterAlternative, setBetterAlternative] = useState<Product[]>([]);

  const NutriScore = product.nutriscore_grade_final as 'a' | 'b' | 'c' | 'd' | 'e';
  
  const nutriScoreImages = {
    a: require('../assets/images/Nutriscore_Icons/Nutri-score-A.png'),
    b: require('../assets/images/Nutriscore_Icons/Nutri-score-B.png'),
    c: require('../assets/images/Nutriscore_Icons/Nutri-score-C.png'),
    d: require('../assets/images/Nutriscore_Icons/Nutri-score-D.png'),
    e: require('../assets/images/Nutriscore_Icons/Nutri-score-E.png'),
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://10.0.7.170:5001/recommend_better_alternatives/${product.code}`,
        );
        setBetterAlternative(response.data);
      } catch (error) {
        if (error instanceof Error) console.error('Error Occured', error.message);
        else console.error('Error Occured', error);
      }
    };
    fetchProducts();
  })



  
  const NutriScoreImageUrl = NutriScore ? nutriScoreImages[NutriScore] : null
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Card containerStyle={styles.mainCardContainer}>
          <Card.Title>{product.product_name}</Card.Title>
          <Card.Divider />
          <View style={styles.productViewWrapper}>
            <Card containerStyle={styles.imageCardContainer}>
              <Image
                style={styles.ProductImage}
                source={productUrl}
                resizeMode='contain'
              />
            </Card>
            <View style={styles.productDetailsContainer}>
              <Image
                style={styles.NutriscoreImageContainer}
                source={NutriScoreImageUrl}
                resizeMode='contain'
              />
              <Text></Text>
            </View>
          </View>
        </Card>

        {/* Big 7 Nutritional Breakdown */}
        <Card containerStyle={styles.nutritionCardContainer}>
            <Card.Title>Nutritional Breakdown</Card.Title>
            <Card.Divider />
            <View style={styles.nutritionList}>
            <Text style={styles.nutritionItem}>Energy: {product.energy_kcal_100g || 0.0} kcal</Text>
            <Text style={styles.nutritionItem}>Fat: {product.energy_from_fat_100g || 0.0} g</Text>
            <Text style={styles.nutritionItem}>Saturated Fat: {product.saturated_fat_100g || 0.0} g</Text>
            <Text style={styles.nutritionItem}>Carbohydrates: {product.carbohydrates_100g || 0.0} g</Text>
            <Text style={styles.nutritionItem}>Total Sugars: {product.sugars_100g || 0.0} g</Text>
            <Text style={styles.nutritionItem}>Added Sugars: {product.added_sugars_100g || 0.0} g</Text>
            <Text style={styles.nutritionItem}>Fiber: {product.fiber_100g || 0.0} g</Text>
            <Text style={styles.nutritionItem}>Proteins: {product.proteins_100g || 0.0} g</Text>
            <Text style={styles.nutritionItem}>Sodium: {product.sodium_100g || 0.0} g</Text>
            </View>
          </Card>

        {/* Better Alternatives Section */}
        {betterAlternative.length > 0 && (
          <Card containerStyle={styles.mainCardContainer}>
        <View style={styles.betterAlternativesContainer}>
          <Text style={styles.sectionTitle}>Better Alternatives</Text>
          <FlatList
            data={betterAlternative}
            horizontal
            keyExtractor={(item) => String(item.code)}
            renderItem={({ item }) => {
              const alternativeNutriScore = item.nutriscore_grade_final as 'a' | 'b' | 'c' | 'd' | 'e';
              const alternativeNutriScoreImage = alternativeNutriScore ? nutriScoreImages[alternativeNutriScore] : null;
            
              return (
                <TouchableOpacity
                onPress={() => navigation.push('ProductScreen', {
                  product: item,
                  productUrl: { uri: item.image_url },
                })}
              >
                <Card containerStyle={styles.alternativeCard}>
                  <Image
                    style={styles.alternativeImage}
                    source={{ uri: item.image_url }}
                    resizeMode="contain"
                  />
                  <Text style={styles.alternativeName}>{item.product_name}</Text>
                  {alternativeNutriScoreImage && (
                    <Image
                      style={styles.NutriscoreImageContainer}
                      source={alternativeNutriScoreImage}
                      resizeMode="contain"
                    />
                  )}
                </Card>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        </Card>
      )}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  NutriscoreImageContainer:{
    width:100,
    height:66
  },
  ProductImage: {
    width: '100%',
    height: '100%',
  },
  mainCardContainer: {
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
    padding:0,
    alignItems:'center',
    width: '48%',
  },

  nutritionItem: {
    fontSize: 16,
    marginVertical: 3,
  },
  nutritionCardContainer: {
      marginTop: 20,
      borderRadius: 10,
      padding: 10,
      paddingHorizontal: 10,
    },

    nutritionList: {
      flexDirection: 'column',
      width: 120,
      marginRight: 10,
      borderRadius: 10,
      padding: 5,
      elevation: 0,
    },

  

  betterAlternativesContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alternativeCard: {
    width: 120,
    marginRight: 10,
    borderRadius: 10,
    padding: 5,
    elevation: 0,
  },
  alternativeImage: {
    width: '100%',
    height: 80,
    marginBottom: 5,
  },
  alternativeName: {
    fontSize: 14,
    textAlign: 'center',
  },



})

