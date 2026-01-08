import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js";

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await userModel.findById(decoded.user.id).select("-password"); //Exclude Password
            next();
        } catch (error) {
            console.log("TOken Verification failed", error);
            res.status(401).json({
                message: "Not Authorized, token failed"
            })
        }
    } else {
        res.status(401).json({
            message: "Not Authorized, no token provided"
        })
    }
}

//Middleware to check if a user is an admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Not Authorized as an admin "
        })
    }
}

export { protect, admin };
