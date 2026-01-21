import { cartModel } from "../models/cartModel.js";
import { checkoutModel } from "../models/checkoutModel.js";
import { orderModel } from "../models/orderModel.js";


export const createCheckOut = async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({
            message: "no items in checkout"
        })
    }

    try {
        const newCheckout = await checkoutModel.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false
        });
        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(200).json(newCheckout);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
}

export const updatePayStatus = async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    try {
        const checkout = await checkoutModel.findById(req.params.id);

        if (!checkout) {
            return res.status(403).json({
                message: "Checkout not found"
            })
        }

        if (paymentStatus === "paid") {
            checkout.isPaid = true,
                checkout.paymentStatus = paymentStatus,
                checkout.paymentDetails = paymentDetails
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout);
        } else {
            res.status(400).json({
                message: "Invalid Payment Status"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
}

export const finalizeCheckOut = async (req, res) => {
    try {
        const checkout = await checkoutModel.findById(req.params.id);

        if (!checkout) {
            return res.status(403).json({
                message: "CheckOut not found"
            })
        }

        if (checkout.isPaid && !checkout.isFinalized) {
            //Create Final Order
            const finalOrder = await orderModel.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            });

            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            //Delete the cart associated with the user
            await cartModel.findByIdAndDelete({ user: checkout.user });
            res.status(200).json(finalOrder);

        } else if (checkout.isFinalized) {
            res.status(400).json({
                message: "checkout is already finalized"
            })
        } else {
            res.status(400).json({
                message: "Checkout is not paid"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        })
    }
}