import  {v2 as cloudinary } from 'cloudinary'
import dotenv from "dotenv";
dotenv.config();

const connectCloudinary = async () => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    })

    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.warn("⚠️ Cloudinary credentials missing. Check your .env file.");
    } else {
    console.log("✅ Cloudinary configured:", process.env.CLOUDINARY_NAME);
    }
}

export default connectCloudinary