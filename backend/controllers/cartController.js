import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";

const getCart = async (userId, guestId) => {
    if (userId) {
        return await cartModel.findOne({ user: userId });
    } else if (guestId) {
        return await cartModel.findOne({ guestId });
    }
    return null;
}

// Helper function to safely calculate total price
const calculateTotalPrice = (products) => {
    return products.reduce((acc, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return acc + (price * quantity);
    }, 0);
}

export const createCart = async (req, res) => {
    try {
        const { productId, quantity, size, color, guestId, userId } = req.body;

        // Validate quantity is a valid number
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({
                message: "Invalid quantity"
            });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Validate product price exists and is a valid number
        if (!product.price || isNaN(product.price)) {
            return res.status(400).json({
                message: "Invalid product price"
            });
        }

        //Determine if the user is logged in or as a guest
        let cart = await getCart(userId, guestId);

        //if the cart exists update it
        if (cart) {
            const productIndex = cart.products.findIndex((p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
            );

            if (productIndex > -1) {
                //if the product already exists update the quantity
                cart.products[productIndex].quantity += parsedQuantity;
            } else {
                //add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity: parsedQuantity,
                });
            }

            // Recalculate the total price using helper function
            cart.totalPrice = calculateTotalPrice(cart.products);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            //Create a new cart for the guest or user
            const totalPrice = product.price * parsedQuantity;

            const newCart = await cartModel.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity: parsedQuantity
                    }
                ],
                totalPrice: totalPrice
            });
            return res.status(200).json(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export const updateQuantityCart = async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        // Validate quantity
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity)) {
            return res.status(400).json({
                message: "Invalid quantity"
            });
        }

        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(403).json({
                message: "Cart not found"
            })
        }

        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if (productIndex > -1) {
            //update quantity
            if (parsedQuantity > 0) {
                cart.products[productIndex].quantity = parsedQuantity;
            } else {
                cart.products.splice(productIndex, 1); //remove prod if quan is 0
            }

            // Safely calculate total price
            cart.totalPrice = calculateTotalPrice(cart.products);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({
                message: "Product is not found in the cart"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export const deleteCartItem = async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(403).json({
                message: "Cart not found"
            })
        }

        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            // Safely calculate total price
            cart.totalPrice = calculateTotalPrice(cart.products);

            await cart.save();
            return res.status(200).json(cart)
        } else {
            return res.status(404).json({
                message: "Product not found in cart"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export const getCartProduct = async (req, res) => {
    const { userId, guestId } = req.query;
    try {
        const cart = await getCart(userId, guestId);

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({
                message: "Cart not found"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export const mergeCart = async (req, res) => {
    const { guestId } = req.body;
    try {
        const guestCart = await cartModel.findOne({ guestId });
        const userCart = await cartModel.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(404).json({
                    message: "Guest cart is empty"
                })
            }
            if (userCart) {
                //Merge with guest cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex((item) =>
                        item.productId.toString() === guestItem.productId.toString() &&
                        item.size === guestItem.size &&
                        item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        //if the item exist in user cart update the quantity
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        // Otherwise add the guest item to the cart
                        userCart.products.push(guestItem);
                    }
                });

                // Safely calculate total price
                userCart.totalPrice = calculateTotalPrice(userCart.products);

                await userCart.save();

                //Remove the Guest Cart
                try {
                    await cartModel.findOneAndDelete({ guestId });
                } catch (error) {
                    console.log("Error deleting guest cart:", error)
                }
                res.status(200).json(userCart);
            } else {
                // If the user has no existing cart then assign the guest cart to the user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                return res.status(200).json(userCart);
            }
            res.status(404).json({
                message: "Guest cart not found"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}