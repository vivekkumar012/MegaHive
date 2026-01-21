import mongoose from "mongoose";
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

export const getQueryProduct = async (req, res) => {
    try {
        const { collection, size, color, gender, minPrice, maxPrice, sortBy,
            search, category, material, brand, limit
        } = req.query;

        let query = {};

        //Filter Logic
        if (collection && collection.toLocaleLowerCase() !== 'all') {
            query.collection = collection;
        }
        if (category && category.toLocaleLowerCase() !== 'all') {
            query.category = category;
        }

        if (material) {
            query.material = { $in: material.split(",") };
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (size) {
            query.sizes = { $in: size.split(",") };
        }

        if (color) {
            query.colors = { $in: [color] };
        }

        if (gender) {
            query.gender = gender;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice) query.price.$lte = Number(maxPrice)
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        }

        let sort = {}
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc":
                    sort = { price: 1 };
                    break;
                case "priceDesc":
                    sort = { price: -1 };
                    break;
                case "popularity":
                    sort = { rating: -1 }
                    break;
                default:
                    break;
            }
        }

        //Fetch Product and apply sorting and limit
        let products = await productModel.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(501).json({
            message: "Error in query access",
            error: error.message
        })
    }
}

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(402).json({
                message: "Product not found!"
            })
        }
        return res.json({
            product
        })
    } catch (error) {
        console.log(error);
        res.status(502).json({
            message: "Server Error in fetching product",
            error: error.message
        })
    }
}

export const getCategoryProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Prevent CastError
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const similarProducts = await productModel.find({
            _id: { $ne: product._id }, // ✅ use ObjectId, not string
            gender: product.gender,
            category: product.category
        }).limit(4);

        res.json(similarProducts);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


export const getHigherRatedProduct = async (req, res) => {
    try {
        const bestSeller = await productModel.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.json(bestSeller)
        } else {
            res.status(404).json({
                message: "No best seller found"
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

export const getNewArrival = async (req, res) => {
    try {
        const newArrivals = await productModel.find().sort({ createdAt: -1 }).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}