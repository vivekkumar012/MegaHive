import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js";

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            // Check if token exists
            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({
                    message: "Not Authorized, invalid token"
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID - handle both token structures
            const userId = decoded.user?.id || decoded.id || decoded._id;
            
            if (!userId) {
                return res.status(401).json({
                    message: "Not Authorized, invalid token structure"
                });
            }

            req.user = await userModel.findById(userId).select("-password");
            
            // Check if user exists
            if (!req.user) {
                return res.status(401).json({
                    message: "Not Authorized, user not found"
                });
            }

            next();
        } catch (error) {
            console.log("Token Verification failed:", error.message);
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: "Not Authorized, token expired"
                });
            }
            
            return res.status(401).json({
                message: "Not Authorized, token failed"
            });
        }
    } else {
        return res.status(401).json({
            message: "Not Authorized, no token provided"
        });
    }
}

//Middleware to check if a user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Not Authorized as an admin"
        })
    }
}

export { protect, admin };