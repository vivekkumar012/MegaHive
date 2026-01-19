import { productModel } from "../models/productModel.js"

export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}

