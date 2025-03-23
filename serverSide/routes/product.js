import express from 'express'
import { handleUserSearch } from '../controllers/product.js'
import { handleGetProductById } from '../controllers/product.js'
export const productRouter = express.Router()

productRouter.route('/Search')
.get(handleUserSearch)

productRouter.route('/:id')
.get(handleGetProductById)