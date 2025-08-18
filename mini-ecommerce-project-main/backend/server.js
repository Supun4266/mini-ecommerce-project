import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRouter from './routes/user/userRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import connectDB from './config/mongodb.js';


//app config
const app = express();
const port = process.env.PORT || 4000
connectDB();

//middleware
app.use(express.json());
app.use(cors())

//api endpoints
app.use('/api/auth/',userRouter);
app.use('/api/products',productRouter);
app.use('/api/orders',orderRouter);

app.listen(port, ()=> console.log("Server started",port));

export default app;