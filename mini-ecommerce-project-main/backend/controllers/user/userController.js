import userModel from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { id : userId },
        process.env.JWT_SECRET,
        { expiresIn: '60m'}
    );

    return { accessToken };
}

const registerUser = async (req,res) => {
    
    try {
        
        const { name , email , password , repwd } = req.body;

        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            return res.status(400).json({ success: false, message:"User already exists!"});
        }

        if(password !== repwd){
            return res.status(400).json({ success: false, message:"Passwords do not match!"});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const userData = {
            name,
            email,
            password:hashedPassword
        }
        
        const newUser = new userModel(userData);
        const user = await newUser.save();

        res.status(201).json({ success: true, message:"Registered Succesfully!" })

    } catch (error) {
        console.error("registerUser error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }

}

const loginUser = async (req,res) => {
    
    try {
        
        const { email , password } = req.body;

        //find user by email
        const user = await userModel.findOne({ email });

        if( !user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        //generate tokens
        const { accessToken } = generateTokens(user._id);

        //send success response
        res.status(200).json({ success: true , accessToken });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred during login" });
    }
}

export {
    registerUser,
    loginUser
}