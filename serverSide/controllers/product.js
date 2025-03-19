import { products } from "../models/product.js"
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