import { productModel } from "../models/productModel.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku, } = req.body;
        if (!name || !description || !price || !countInStock || !sku || !category || !sizes || !colors || !collections || !isFeatured || !isPublished) {
            return res.status(409).json({
                message: "All fields are required for creating a product !!!"
            })
        }
        const product = await productModel.create({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id
        })

        res.status(201).json({
            product
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error in Creating Product",
            error: error.message
        })
    }
}