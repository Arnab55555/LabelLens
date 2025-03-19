import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './connections/product.js'
import { productRouter } from './routes/product.js'
dotenv.config()
const app = express()

const mongo_url = process.env.MONGO_URL
const port = process.env.PORT || 8000

connectDB(mongo_url)
.then(()=>console.log("MongoDB Connected"))
.catch((error)=>console.log("Error Occured",error))

app.use('/api/product',productRouter)


app.listen(port,()=>console.log("Server Started"))