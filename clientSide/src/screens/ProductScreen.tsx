import React from 'react'
import { Text, SafeAreaView, StyleSheet, ScrollView, View } from 'react-native'
import { StackTabParamList } from '../navigation/HomeNavigator'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Card, Image } from '@rneui/base'

type ProductScreenProps = NativeStackScreenProps<StackTabParamList, 'ProductScreen'>

export default function ProductScreen({ navigation, route }: ProductScreenProps) {
  const { product, productUrl } = route.params

  const NutriScore = product.nutriscore_grade_final as 'a' | 'b' | 'c' | 'd' | 'e';
  
  const nutriScoreImages = {
    a: require('../assets/images/Nutriscore_Icons/Nutri-score-A.png'),
    b: require('../assets/images/Nutriscore_Icons/Nutri-score-B.png'),
    c: require('../assets/images/Nutriscore_Icons/Nutri-score-C.png'),
    d: require('../assets/images/Nutriscore_Icons/Nutri-score-D.png'),
    e: require('../assets/images/Nutriscore_Icons/Nutri-score-E.png'),
  }
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
  nutritionCardContainer: {
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
  },
  nutritionList: {
    flexDirection: 'column',
    padding: 5,
  },
  nutritionItem: {
    fontSize: 16,
    marginVertical: 3,
  }
})

