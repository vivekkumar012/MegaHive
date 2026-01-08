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

export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku, } = req.body;

        const product = await productModel.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.colors = colors || product.colors;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(403).json({
                message: "Product not found"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error in updating product",
            error: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (product) {
            await product.deleteOne();
            res.json({
                message: "Product removed"
            })
        } else {
            res.status(404).json({
                message: "Product not found"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: "Error while deleting the product",
            error: error.message
        })
    }
}