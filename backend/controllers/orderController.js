import { orderModel } from "../models/orderModel.js"



export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({user: req.user._id}).sort({createdAt: -1}); 
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderModel.findById(id).populate("user", "name email");

        if(!order) {
            return res.status(400).json({
                message: "order not found"
            })
        }

        res.json(order);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
}