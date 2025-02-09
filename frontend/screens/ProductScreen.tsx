import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Card } from "react-native-paper";
import React, { useEffect, useState } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import axios from 'axios';
type ProductScreenProps=NativeStackScreenProps<RootStackParamList,'ProductScreen'>

interface product {
    _id: string;
    code: number;
    url: string;
    product_name: string;
    quantity: string;
    brands: string;
    categories: string;
    ingredients_text: string;
    ingredients_analysis_tags: string;
    additives_n: number;
    nutriscore_grade: string;
    pnns_groups_1: string;
    pnns_groups_2: string;
    product_quantity: number;
    main_category_en: string;
    image_url: string;
    image_small_url: string;
    image_ingredients_url: string;
    image_ingredients_small_url: string;
    image_nutrition_url: string;
    image_nutrition_small_url: string;
    energy_kcal_100g: number;
    energy_100g: number;
    fat_100g: number;
    saturated_fat_100g: number;
    carbohydrates_100g: number;
    sugars_100g: number;
    fiber_100g: number;
    proteins_100g: number;
    salt_100g: number;
    fruits_vegetables_nuts_estimate_from_ingredients_100g: number;
    nutriscore_score_final: number;
    nutriscore_grade_final: string;
  }


// const getNutriScoreImage = (grade: string | null) => {
//     switch (grade) {
//       case "a":
//         return require("F:\\Documents\\GitHub\\LabelLens\\frontend\\screens\\Nutri-score-A.svg");
//       case "b":
//         return require("F:\\Documents\\GitHub\\LabelLens\\frontend\\screens\\Nutri-score-B.svg");
//       case "c":
//         return require("F:\\Documents\\GitHub\\LabelLens\\frontend\\screens\\Nutri-score-C.svg");
//       case "d":
//         return require("F:\\Documents\\GitHub\\LabelLens\\frontend\\screens\\Nutri-score-D.svg");
//       case "e":
//         return require("F:\\Documents\\GitHub\\LabelLens\\frontend\\screens\\Nutri-score-E.svg");
//       default:
//         return null;
//     }
//   };

const ProductScreen = ({navigation,route}:ProductScreenProps) => {
    const { ProductId } = route.params;
    console.log(ProductId)
    const [barcode, setBarcode] = useState<string>('');
    const [Product, setProduct] = useState<product | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log("First useeffect")
        setBarcode(ProductId);
    }, [ProductId]);

    useEffect(() => {
        console.log("second useeffect")
        if (barcode) {
            SearchProduct();
        }
    }, [barcode]);

    const SearchProduct = async () => {
        console.log("under searchproduct")
        try {
            
            setLoading(true);
            console.log("under searchproduct try block")
            const response = await axios.get(`http://192.168.156.239:3000/searchProductBarcode?barcode=${barcode}`);
            console.log("outoff searchproduct try block")
            setProduct(response.data);
            console.log("done fetching")
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch product');
        }
    };

    if (loading) {
        console.log("under Loading")
        return <Text>Loading...</Text>;
    }

    console.log("under main jsx")
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
      {/* Product Image Card */}
      <Card style={styles.imageCard}>
        <Card.Cover source={{ uri: Product?.image_url }} style={styles.image} />
      </Card>
        {/* Nutri-Score Card */}
      {/* <Card style={styles.detailCard}>
          <Card.Content style={styles.nutriScoreContainer}>
            <Text style={styles.label}>Nutri-Score:</Text>
            {Product?.nutriscore_grade_final ? (
              <Image source={getNutriScoreImage(Product.nutriscore_grade_final)} style={styles.nutriScoreImage} />
            ) : (
              <Text style={styles.value}>N/A</Text>
            )}
          </Card.Content>
        </Card> */}
      {/* Small Cards for Product Details */}
      <View style={styles.detailsContainer}>
        <DetailCard label="Barcode" value={ProductId} />
        <DetailCard label="NutriScore" value={Product?.nutriscore_grade_final || 'N/A'} />
        <DetailCard label="Product Name" value={Product?.product_name || 'N/A'} />
        <DetailCard label="Quantity" value={Product?.quantity || 'N/A'} />
        <DetailCard label="Brands" value={Product?.brands || 'N/A'} />
        <DetailCard label="Categories" value={Product?.categories || 'N/A'} />
        <DetailCard label="Energy" value={`${Product?.energy_100g || 0} kcal`} />
        <DetailCard label="Fat" value={`${Product?.fat_100g || 0}g`} />
        <DetailCard label="Sugars" value={`${Product?.sugars_100g || 0}g`} />
        <DetailCard label="Fibers" value={`${Product?.fiber_100g || 0}g`} />
        <DetailCard label="Proteins" value={`${Product?.proteins_100g || 0}g`} />
      </View>
    </ScrollView>
        // <View>
        //     {Product ? (
        //         <>
        //             <Text>Barcode: {ProductId}</Text>
        //             <Text>Product Name: {Product.product_name}</Text>
        //             <Text>Product Quantity: {Product.quantity}</Text>
        //             <Text>Product Brands: {Product.brands}</Text>
        //             <Text>Product Categories: {Product.categories}</Text>
        //             <Text>Product Energy: {Product.energy_100g}</Text>
        //             <Text>Product Fat: {Product.fat_100g}</Text>
        //             <Text>Product Sugars: {Product.sugars_100g}</Text>
        //             <Text>Product Fibers: {Product.fiber_100g}</Text>
        //             <Text>Product Proteins: {Product.proteins_100g}</Text>
        //             <Text>Product NutriScore: {Product.nutriscore_grade_final}</Text>
        //         </>
        //     ) : (
        //         <Text>{error}</Text>
        //     )}
        // </View>
    );
  
}
interface DetailCardProps {
    label: string;
    value: string | number;
  }

  const DetailCard: React.FC<DetailCardProps> = ({ label, value }) => (
    <Card style={styles.detailCard}>
      <Card.Content>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
      </Card.Content>
    </Card>
  );
  
const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      padding: 10,
    },
    imageCard: {
      width: "90%",
      borderRadius: 12,
      overflow: "hidden",
      elevation: 4,
    },
    image: {
      height: 200,
      borderRadius: 12,
    },
    detailsContainer: {
      width: "90%",
      marginTop: 10,
    },
    detailCard: {
      backgroundColor: "#f8f9fa",
      marginVertical: 6,
    //   padding: 10,
      elevation: 3,
    },
    label: {
      fontSize: 14,
      fontWeight: "bold",
      color: "#333",
    },
    value: {
      fontSize: 16,
      color: "#555",
    },
    nutriScoreContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      nutriScoreImage: {
        width: 80,
        height: 40,
        resizeMode: "contain",
        marginLeft: 10,
      },
  });
export default ProductScreen