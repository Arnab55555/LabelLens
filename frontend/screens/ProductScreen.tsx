import { View, Text } from 'react-native'
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
            const response = await axios.get(`http://192.168.0.104:3000/searchProductBarcode?barcode=${barcode}`);
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
        <View>
            {Product ? (
                <>
                    <Text>Barcode: {ProductId}</Text>
                    <Text>Product Name: {Product.product_name}</Text>
                    <Text>Product Quantity: {Product.quantity}</Text>
                    <Text>Product Brands: {Product.brands}</Text>
                    <Text>Product Categories: {Product.categories}</Text>
                    <Text>Product Energy: {Product.energy_100g}</Text>
                    <Text>Product Fat: {Product.fat_100g}</Text>
                    <Text>Product Sugars: {Product.sugars_100g}</Text>
                    <Text>Product Fibers: {Product.fiber_100g}</Text>
                    <Text>Product Proteins: {Product.proteins_100g}</Text>
                    <Text>Product NutriScore: {Product.nutriscore_grade_final}</Text>
                </>
            ) : (
                <Text>{error}</Text>
            )}
        </View>
    );
  
}

export default ProductScreen