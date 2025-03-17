import { products } from "../models/product.js"
export async function handleUserSearch(req,res){
    try{
        const productList = await products.find({ category:{ $ne:"Non-Food" } })
        return res.status(200).send(productList)
    }
    catch(error){
        return res.status(500).json({message:"Error while fetching products",error:`${error}`})
    }
}