import { products } from "../models/product.js"
import cloudinary from "../cloudinaryConfig.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const analyzeImageWithGemini = async (fileBuffer, prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent([prompt, { inlineData: { data: fileBuffer.toString('base64'), mimeType: 'image/png' } }]);

        // Extract and parse JSON content safely
        const textResponse = result.response.text();
        const jsonMatch = textResponse.match(/\{.*\}/s);
        if (!jsonMatch) throw new Error("Invalid JSON response from Gemini");

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to analyze image with Gemini");
    }
};

export const uploadProductImages = async (req, res) => {
    console.log('Front Image:', req.files['frontImage']);
    console.log(req.body.barCode);

    try {
        const uploadToCloudinary = async (file) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'image' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }).end(file.buffer);
            });
        };

        // Upload images to Cloudinary
        const frontImageUrl = await uploadToCloudinary(req.files.frontImage[0]);
        const nutritionImageUrl = await uploadToCloudinary(req.files.nutritionImage[0]);
        const ingredientsImageUrl = await uploadToCloudinary(req.files.ingredientsImage[0]);

        // Extract data using Gemini API
        const frontImageData = await analyzeImageWithGemini(req.files.frontImage[0].buffer, `Extract the product name and brand from the following image. Return a JSON object with all the details. Refer this schema to create json 
        {
        brand: string,
        product_name: string
        }`);

        const nutritionImageData = await analyzeImageWithGemini(req.files.nutritionImage[0].buffer, `Extract the big 7 nutrients (calories, fat, carbs, protein, fiber, sugar, salt, fruits/vegetables/legumes, saturated fat) from the following nutritional information. Return a JSON object with all the details. Refer this schema to create json
        {
        calories: number, // Energy content in kcal (default to 0 if not found)
        fat: number, // Total fat in grams (default to 0 if not found)
        carbs: number, // Total carbohydrates in grams (default to 0 if not found)
        protein: number, // Protein content in grams (default to 0 if not found)
        fiber: number, // Fiber content in grams (default to 0 if not found)
        sugar: number, // Sugar content in grams (default to 0 if not found)
        salt: number, // Salt content in grams (default to 0 if not provided, calculated as sodium (mg) * 2.5 / 1000)
        fruits_vegetables_legumes: number, // fruits vegetables legumes content in grams (default to 0 if not found)
        saturated_fat: number // Saturated fat content in grams (default to 0 if not found)
        }
            `);

        const ingredientsImageData = await analyzeImageWithGemini(req.files.ingredientsImage[0].buffer, `Extract the ingredients, additives, and allergens from the following ingredient list. For each, provide a brief description in two lines. Assign a category to this product (product_category) but it should only belong to these categories (Beverages, Cheese, Dairy, Fat/Nuts/Oil/Seeds, General Food, Red Meat, Water).Assign one more specific product_category (specific_product_category) and Return a JSON object with all the details.
        Refer this schema to create json
        ingredients: [
            {
                name: string,
                description: string
            }
        ],
        additives: [
            {
                name: string, 
                description: string 
            }
        ],
        allergens: [
            {
                name: string, 
                description: string 
            }
        ],
        product_category: string, 
        specific_product_category: string
        }
            `);

        
        const nutriData = {
            energy_100g: nutritionImageData.calories*4,
            fat_100g: nutritionImageData.fat,
            saturated_fat_100g: nutritionImageData.saturated_fat,
            carbohydrates_100g: nutritionImageData.carbs,
            sugars_100g: nutritionImageData.sugar,
            proteins_100g: nutritionImageData.protein,
            salt_100g: nutritionImageData.salt,
            fruits_vegetables_nuts_estimate_from_ingredients_100g:nutritionImageData.fruits_vegetables_legumes,
            fiber: nutritionImageData.fiber,
            category: ingredientsImageData.product_category,
        };
        
        const response = await axios.post('http://192.168.0.100:5001/api/nutriscore', nutriData);
        
        console.log(response)
        //Save product to MongoDB
        try{
        const productSaved = await products.create({
            code: req.body.barCode,
            product_name:frontImageData.product_name,
            brands:frontImageData.brand,
            image_url: frontImageUrl,
            image_nutrition_url: nutritionImageUrl,
            image_ingredients_url: ingredientsImageUrl,
            energy_kcal_100g:nutritionImageData.calories,
            energy_100g:nutritionImageData.calories*4,
            fat_100g:nutritionImageData.fat,
            saturated_fat_100g:nutritionImageData.saturated_fat,
            carbohydrates_100g:nutritionImageData.carbs,
            proteins_100g:nutritionImageData.protein,
            fiber_100g:nutritionImageData.fiber,
            sugars_100g:nutritionImageData.sugar,
            salt_100g:nutritionImageData.salt,
            fruits_vegetables_nuts_estimate_from_ingredients_100g:nutritionImageData.fruits_vegetables_legumes,
            category:ingredientsImageData.product_category,
            product_category:ingredientsImageData.specific_product_category,
            nutriscore_score_final:response.data.nutriscore_score,
            nutriscore_grade_final:response.data.nutriscore_grade,
            ingredients_info: ingredientsImageData.ingredients,
            additives_info:ingredientsImageData.additives,
            allergens_info:ingredientsImageData.allergens,
            isNewProduct:true
        });
    }catch(error){
        console.error('Error uploading and analyzing:', error);
        return res.status(500).json({ error:"Error occured while adding data to mongodb"})
    }
        console.log(frontImageData);
        console.log(nutritionImageData)
        console.log(ingredientsImageData)
        return res.status(200).json({ message: 'Images uploaded and analyzed successfully!' });
    } catch (error) {
        console.error('Error uploading and analyzing:', error);
        return res.status(500).json({ error: 'Image upload or analysis failed' });
    }
};


export async function handleUserSearch(req,res){
    const { q } = req.query
    try{
        const productList = await products.find({ 
            product_name:{ $regex:q,$options:'i'}, 
            category:{ $ne:"Non-Food" }, 
            nutriscore_grade_final:{ $ne:"Nutri-Score is not applicable"} 
        })
        return res.status(200).send(productList)
    }
    catch(error){
        return res.status(500).json({message:"Error while fetching products",error:`${error}`})
    }
}

export async function handleGetProductById(req,res){
    const { id } = req.params
    try{
        const product = await products.findOne({
            code:id
        })
        console.log(product)
        return res.status(200).send(product)
    }catch(error){
        return res.status(500).json({message:"Error while fetching product by id",error:`${error}`})
    }
}

export async function handleGetProductByCategory(req,res){
    const { category } = req.params
    try{
        const product = await products.find({
            category:category
        })
        console.log(product)
        return res.status(200).send(product)
    }catch(error){
        return res.status(500).json({message:"Error while fetching product by id",error:`${error}`})
    }
}