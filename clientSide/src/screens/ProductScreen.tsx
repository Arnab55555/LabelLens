import React, { useState } from 'react'
import { Text, SafeAreaView, StyleSheet, ScrollView, View, FlatList, TouchableOpacity } from 'react-native'
import { StackTabParamList } from '../navigation/HomeNavigator'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Card, Image } from '@rneui/base'
import axios from 'axios'
import { useEffect } from 'react'
import { Product } from './ProductSearchScreen'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type ProductScreenProps = NativeStackScreenProps<StackTabParamList, 'ProductScreen'>

// Nutrition classification helper function
const classifyNutrient = (nutrient: string, value: number) => {
  // FSSAI "Red Label" thresholds (for Concerning)
  const concerningThresholds = {
    energy_kcal_100g: { value: 500, unit: 'kcal' },
    saturated_fat_100g: { value: 5, unit: 'g' },
    sugars_100g: { value: 10, unit: 'g' },
    salt_100g: { value: 0.5, unit: 'g' }, // 500mg = 0.5g
    added_sugars_100g: { value: 0, unit: 'g' }, // Any added sugar is concerning
  };

  // FSSAI "Green Label" thresholds (for Likeable)
  const likeableThresholds = {
    fiber_100g: { value: 3, unit: 'g' },
    proteins_100g: { value: 5, unit: 'g' },
  };

  const classification = {
    isConcerning: false,
    isLikeable: false,
    unit: 'g' // default
  };

  // Check concerning thresholds
  if (nutrient in concerningThresholds) {
    const threshold = concerningThresholds[nutrient as keyof typeof concerningThresholds];
    classification.unit = threshold.unit;
    if (value > threshold.value) {
      classification.isConcerning = true;
    }
  }

  // Check likeable thresholds
  if (nutrient in likeableThresholds) {
    const threshold = likeableThresholds[nutrient as keyof typeof likeableThresholds];
    classification.unit = threshold.unit;
    if (value >= threshold.value) {
      classification.isLikeable = true;
    }
  }

  return classification;
};


const ExpandableSection = ({ title, items }: { title: string, items: Array<{name: string, description: string}> }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card containerStyle={styles.sectionCard}>
      <TouchableOpacity 
        onPress={() => setExpanded(!expanded)}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <MaterialIcons 
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
          size={24} 
          color="#6200EE" 
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.sectionContent}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};



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
          `http://192.168.0.100:5001/recommend_better_alternatives/${product.code}`,
        );
        setBetterAlternative(response.data);
      } catch (error) {
        if (error instanceof Error) console.error('Error Occured', error.message);
        else console.error('Error Occured', error);
      }
    };
    fetchProducts();
  },[])

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

        {/* Nutritional Breakdown */}
        <Card containerStyle={styles.nutritionCardContainer}>
          <Card.Title>Nutritional Breakdown (per 100g)</Card.Title>
          <Card.Divider />
          <View style={styles.nutritionList}>
            {[
              { label: 'Energy', key: 'energy_kcal_100g', value: product.energy_kcal_100g || 0 },
              { label: 'Fat', key: 'fat_100g', value: product.fat_100g || 0 },
              { label: 'Saturated Fat', key: 'saturated_fat_100g', value: product.saturated_fat_100g || 0 },
              { label: 'Carbohydrates', key: 'carbohydrates_100g', value: product.carbohydrates_100g || 0 },
              { label: 'Total Sugars', key: 'sugars_100g', value: product.sugars_100g || 0 },
              { label: 'Added Sugars', key: 'added_sugars_100g', value: product.added_sugars_100g || 0 },
              { label: 'Fiber', key: 'fiber_100g', value: product.fiber_100g || 0 },
              { label: 'Proteins', key: 'proteins_100g', value: product.proteins_100g || 0 },
              { label: 'Salt', key: 'salt_100g', value: product.salt_100g || 0 },
            ].map((item) => {
              const classification = classifyNutrient(item.key, item.value);
              return (
                <View 
                  key={item.key}
                  style={[
                    styles.nutritionItemContainer,
                    classification.isConcerning && styles.concerningItem,
                    classification.isLikeable && styles.likeableItem
                  ]}
                >
                  <Text style={styles.nutritionLabel}>{item.label}:</Text>
                  <Text style={styles.nutritionValue}>
                    {item.value.toFixed(2)} {classification.unit}
                  </Text>
                  {classification.isConcerning && (
                    <Text style={styles.warningText}> (High)</Text>
                  )}
                  {classification.isLikeable && (
                    <Text style={styles.positiveText}> (Good)</Text>
                  )}
                </View>
              );
            })}
          </View>
        </Card>

            {/* Ingredients Section */}
        {product.ingredients_info && product.ingredients_info.length > 0 && (
          <ExpandableSection 
            title="Ingredients" 
            items={product.ingredients_info.map(i => ({name: i.name ?? 'Default Name', description: i.description ?? 'No description available'}))} 
          />
        )}

        {/* Allergens Section */}
        {product.allergens_info && product.allergens_info.length > 0 && (
          <ExpandableSection 
            title="Allergens" 
            items={product.allergens_info.map(a => ({name: a.name ?? 'Default Name', description: a.description ?? 'No description available'}))} 
          />
        )}

        {/* Additives Section */}
        {product.additives_info && product.additives_info.length > 0 && (
          <ExpandableSection 
            title="Additives" 
            items={product.additives_info.map(a => ({name: a.name ?? 'Default Name', description: a.description ?? 'No description available'}))} 
          />
        )}




        
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
  NutriscoreImageContainer: {
    width: 100,
    height: 66
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
    margin: 0,
    padding: 0,
    flex: 1,
    flexDirection: 'row',
  },
  imageCardContainer: {
    margin: 0,
    marginRight: 10,
    width: '50%',
    minHeight: 160,
    borderRadius: 10,
    padding: 5,
    elevation: 0,
  },
  productDetailsContainer: {
    padding: 0,
    alignItems: 'center',
    width: '48%',
  },
  nutritionCardContainer: {
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
  },
  nutritionList: {
    flexDirection: 'column',
  },
  nutritionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    padding: 8,
    borderRadius: 5,
  },
  concerningItem: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  likeableItem: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  nutritionLabel: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  warningText: {
    color: '#F44336',
    fontSize: 12,
    marginLeft: 5,
  },
  positiveText: {
    color: '#4CAF50',
    fontSize: 12,
    marginLeft: 5,
  },
  betterAlternativesContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
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
  sectionCard: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionContent: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 10,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});