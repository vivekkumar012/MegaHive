import { orderModel } from "../models/orderModel.js";

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("user", "name email");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (order) {
            order.status = req.body.status;
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

            const updatedOrder = await order.save();
            res.json(updatedOrder)
        } else {
            res.status(404).json({
                message: "order not found"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

export const deleteOrderAdmin = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({
                message: "Order removed"
            })
        } else {
            res.status(404).json({
                message: "Order not found"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}