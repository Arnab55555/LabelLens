import { products } from "../models/product.js"
import { extractTextFromImage, analyzeTextWithGemini } from '../utils/apiHelpers.js';
import cloudinary from "../cloudinaryConfig.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

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
        const frontImageData = await analyzeImageWithGemini(req.files.frontImage[0].buffer, "Extract the product name and brand from the following image. Return a JSON object with all the details.");

        const nutritionImageData = await analyzeImageWithGemini(req.files.nutritionImage[0].buffer, "Extract the big 7 nutrients (calories, fat, carbs, protein, fiber, sugar, salt, fruits/vegetables/legumes, saturated fat) from the following nutritional information. Return a JSON object with all the details.");

        const ingredientsImageData = await analyzeImageWithGemini(req.files.ingredientsImage[0].buffer, "Extract the ingredients, additives, and allergens from the following ingredient list. For each, provide a brief description in two lines. Return a JSON object with all the details.");

        // Save product to MongoDB
        // const productSaved = await products.create({
        //     code: req.body.barCode,
        //     image_url: frontImageUrl,
        //     image_nutrition_url: nutritionImageUrl,
        //     image_ingredients_url: ingredientsImageUrl,
        //     product_info: frontImageData,
        //     nutrition_info: nutritionImageData,
        //     ingredients_info: ingredientsImageData
        // });

        console.log(frontImageData);
        console.log(nutritionImageData)
        console.log(ingredientsImageData)
        res.status(200).json({ message: 'Images uploaded and analyzed successfully!' });
    } catch (error) {
        console.error('Error uploading and analyzing:', error);
        res.status(500).json({ error: 'Image upload or analysis failed' });
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