import { userModel } from "../models/userModel.js";


export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

export const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user = await userModel.findOne({ email });

        if (user) {
            return res.status(401).json({
                message: "User already exist"
            })
        }

        user = new userModel({
            name,
            email,
            password,
            role: role || "customer"
        })

        await user.save();

        res.status(201).json({
            message: "User created successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (user) {
            user.name = req.body.name || user.name,
                user.email = req.body.email || user.email,
                user.role = req.body.role || user.role
        }
        const updatedUser = await user.save();
        res.json({
            message: "User updated successfully",
            user: updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if(user) {
            await user.deleteOne();
            res.status(201).json({
                message: "user deleted successfully"
            })
        } else {
            res.status(402).json({
                message: "user not found"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}