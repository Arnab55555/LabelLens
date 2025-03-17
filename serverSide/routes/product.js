import express from 'express'
import { handleUserSearch } from '../controllers/product.js'
export const productRouter = express.Router()

productRouter.route('/Search')
.get(handleUserSearch)