// models/User.js
import mongoose from "mongoose";

const { Schema , model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true }, 
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const userModel = model("User", userSchema);

export default userModel;
