import jwt from 'jsonwebtoken'

const authUser = async (req,res,next) => {
    try {
        
        const token = req.headers.uToken;

        if(!token){
            return res.status(401).json({success: false,message:"Not Authorized, Login again!"});
        }

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.body.userId = decoded.userId

        next();

    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ success: false, message: error.message });
    }
};

export default authUser;