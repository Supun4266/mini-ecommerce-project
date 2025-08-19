// authAdmin.js
import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {

    const headerToken = req.get("uToken") || req.get("authorization");

    if (!headerToken) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing. Login again!" });
    }

  
    const token = headerToken.startsWith("Bearer ")
      ? headerToken.split(" ")[1]
      : headerToken;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing. Login again!" });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const userId = decoded?.id || decoded?.userId;
    const role = decoded?.role; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid token payload." });
    }

    // attach to req for downstream use
    req.user = { id: userId, role };
    
    // only set req.body.userId if req.body exists and is an object
    if (req.body && typeof req.body === "object") {
      req.body.userId = userId; // keep legacy behavior if other code relies on it
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ success: false, message: error.message || "Invalid token." });
  }
};

export default authAdmin;
