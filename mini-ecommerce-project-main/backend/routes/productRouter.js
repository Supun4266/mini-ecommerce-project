import express from 'express'
import authUser from '../middleware/authUser.js';
import { addProducts, deleteProduct, getAllProducts, getProductsById, updateProduct } from '../controllers/products/productController.js';
import authAdmin from '../middleware/authAdmin.js';

const productRouter = express.Router();

productRouter.get("/get-products",authUser,getAllProducts);
productRouter.get("/get-products/:productId",authUser,getProductsById);
productRouter.post("/add-product",authAdmin,addProducts);
productRouter.patch("/update-product/:productId",authAdmin,updateProduct);
productRouter.delete("/delete-product/:productId",authAdmin,deleteProduct);

export default productRouter;