import express from 'express'
import authUser from '../middleware/authUser.js';
import { addProducts, deleteProduct, getAllProducts, getProductsById, updateProduct } from '../controllers/products/productController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

productRouter.get("/get-products",authUser,getAllProducts);
productRouter.get("/get-products/:productId",authUser,getProductsById);
productRouter.post("/add-product",authAdmin,upload.single("imageUrl"),addProducts);
productRouter.patch("/update-product/:productId",upload.single("imageUrl"),authAdmin,updateProduct);
productRouter.delete("/delete-product/:productId",authAdmin,deleteProduct);

export default productRouter;