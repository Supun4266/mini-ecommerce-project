import express from 'express'
import { addOrder, getOrderDetails } from '../controllers/Order/orderController.js';
import authAdmin from '../middleware/authAdmin.js';
import authUser from '../middleware/authUser.js';

const orderRouter = express.Router();

orderRouter.post("/add-order",authUser,addOrder);
orderRouter.get("/get-orders",authAdmin,getOrderDetails);
orderRouter.get("/get-orders/:userId",authUser,getOrderDetails);

export default orderRouter;