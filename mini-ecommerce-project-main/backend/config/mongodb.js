import mongoose from 'mongoose'

let connection = null;

const connectDB = async () => {
    
    try {

        connection = mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`);

        await connection;
        console.log("Database connection established");
        
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }

}

export default connectDB;