// models/Order.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true } 
);

const orderModel = model("Order", orderSchema);

export default orderModel;
