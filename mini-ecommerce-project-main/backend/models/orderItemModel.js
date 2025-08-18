// models/OrderItem.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderItemSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true, min: 0 }, 
  },
  { timestamps: true }
);
const orderItemModel = model("OrderItem", orderItemSchema);

export default orderItemModel;
