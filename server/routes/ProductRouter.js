import express from 'express';
import { upload } from '../configs/multer.js';
import AuthSeller from '../middlewares/AuthSeller.js';
import {
  addProduct,
  changeStock,
  productById,
  productList,
} from '../controllers/ProductController.js';

const ProductRouter = express.Router();

ProductRouter.post('/add', upload.array(['images']), AuthSeller, addProduct),
  ProductRouter.get('/list', productList);
ProductRouter.get('/id', productById);
ProductRouter.post('/stock', AuthSeller, changeStock);
export default ProductRouter;
