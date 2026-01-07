import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All Fields Are required for register"
            })
        }
        const ExistUser = await userModel.findOne({
            email: email
        });
        if (ExistUser) {
            return res.status(401).json({
                message: "User Already Exist"
            })
        }
        //hash password
        const hashPass = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashPass
        })

        const payload = { user: { id: newUser._id, role: newUser.role } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;

            res.status(200).json({
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                },
                token,
                message: "User register successfully"
            })
        })


    } catch (error) {
        console.log("Error in Register", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(409).json({
                message: "All fields are required for login"
            })
        }
        const user = await userModel.findOne({
            email
        })
        if (!user) {
            return res.status(402).json({
                message: "User Not Found with this Email"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({
                message: "Password do not match, try again!!"
            })
        }
        const payload = { user: { id: user._id, role: user.role } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
                message: "User Login successfully"
            })
        })
    } catch (error) {
        console.log("Error in Login", error);
        res.status(500).json({
            error: error.message
        })
    }
}

export const getProfile = async (req, res) => {
    res.json(req.user);
}