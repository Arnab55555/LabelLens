import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Image, SearchBar } from '@rneui/themed';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackTabParamList } from '../navigation/HomeNavigator';
import { Product } from './ProductSearchScreen';

type ProductListScreenProps = NativeStackScreenProps<StackTabParamList, 'ProductListScreen'>;

export default function ProductListScreen({ route, navigation }: ProductListScreenProps): React.JSX.Element {
  const { category } = route.params; // Get category from route params
  const [products, setProducts] = useState<Product[]>([]); // All products fetched from the API
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Products filtered by search query
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Nutri-Score images mapping
  const nutriScoreImages = {
    a: require('../assets/images/Nutriscore_Icons/Nutri-score-A.png'),
    b: require('../assets/images/Nutriscore_Icons/Nutri-score-B.png'),
    c: require('../assets/images/Nutriscore_Icons/Nutri-score-C.png'),
    d: require('../assets/images/Nutriscore_Icons/Nutri-score-D.png'),
    e: require('../assets/images/Nutriscore_Icons/Nutri-score-E.png'),
  };

  // Fetch products based on category
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Category:', category);
        const response = await axios.get(`http://192.168.65.120:3000/api/product/category/${category}`);
        setProducts(response.data); // Set all products
        setFilteredProducts(response.data); // Initialize filtered products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Handle search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products); // Reset to all products if search query is empty
    } else {
        const filtered = products.filter((product) =>
            product.product_name?.toLowerCase().includes(query.toLowerCase())
          );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <SearchBar
        placeholder="Search for Packaged Food"
        value={searchQuery}
        onChangeText={handleSearch}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={styles.searchBarInput}
        platform="android"
      />

      {/* No Products Found */}
      {filteredProducts.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No products found.</Text>
      )}

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.code)}
        numColumns={2} // Display two products per row
        renderItem={({ item }) => {
          const imageUrl =
            item.image_url ?? item.image_ingredients_url ?? item.image_nutrition_url;
          const productUrl = imageUrl ? { uri: imageUrl } : require('../assets/images/Image_Not_Available.jpg');

          const nutriScoreImage =
            item.nutriscore_grade_final && nutriScoreImages[item.nutriscore_grade_final.toLowerCase() as 'a' | 'b' | 'c' | 'd' | 'e'];

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ProductScreen', {
                  product: item,
                  productUrl: productUrl,
                })
              }
              style={styles.cardWrapper}
            >
              <Card containerStyle={styles.cardContainer}>
                <Image
                  style={styles.productImage}
                  source={productUrl}
                  resizeMode="contain"
                />
                <Card.Divider />
                <Text style={styles.productName}>{item.product_name}</Text>
                {nutriScoreImage && (
                  <Image
                    style={styles.nutriScoreImage}
                    source={nutriScoreImage}
                    resizeMode="contain"
                  />
                )}
              </Card>
            </TouchableOpacity>
          );
        }}
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
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
    },
    searchBarInput: {
      borderRadius: 10,
      backgroundColor: 'white',
    },
    cardWrapper: {
      flex: 1,
      margin: 3,
    },
    cardContainer: {
      borderRadius: 10,
      margin: 0,
      elevation: 0,
      padding: 12,
      height: 250,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    productImage: {
      width: '100%',
      height: 120,
      marginBottom: 10,
      resizeMode: 'contain',
    },
    productName: {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 5,
    },
    nutriScoreImage: {
      width: 100,
      height: 40,
      alignSelf: 'center',
      marginTop: 3,
    },
  });