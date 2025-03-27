import express from 'express'
import { handleUserSearch } from '../controllers/product.js'
import { handleGetProductById } from '../controllers/product.js'
import { uploadProductImages } from '../controllers/product.js';
import { handleGetProductByCategory } from '../controllers/product.js'

import multer from 'multer';

export const productRouter = express.Router()


const storage = multer.memoryStorage();
const upload = multer({ storage });

productRouter.route('/Search')
.get(handleUserSearch)

productRouter.route('/:id')
.get(handleGetProductById)

productRouter.route('/upload')
  .post(upload.fields([
    { name: 'frontImage'},
    { name: 'nutritionImage'},
    { name: 'ingredientsImage'},
  ]), uploadProductImages)

productRouter.route('/category/:category')
.get(handleGetProductByCategory)