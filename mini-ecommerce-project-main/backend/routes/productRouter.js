import express from 'express'
import authUser from '../middleware/authUser.js';
import { addProducts, deleteProduct, getAllProducts, getProductsById, updateProduct } from '../controllers/products/productController.js';
import authAdmin from '../middleware/authAdmin.js';

const productRouter = express.Router();

productRouter.get("/",authUser,getAllProducts);
productRouter.get("/:productId",authUser,getProductsById);
productRouter.post("/add-product",authAdmin,addProducts);
productRouter.patch("/:id",authAdmin,updateProduct);
productRouter.delete("/:id",authAdmin,deleteProduct);

export default productRouter;