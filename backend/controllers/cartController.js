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

            // Recalculate the total price
            cart.totalPrice = cart.products.reduce((acc, item) => {
                const itemTotal = (item.price || 0) * (item.quantity || 0);
                return acc + itemTotal;
            }, 0);

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
        let cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(403).json({
                message: "Cart not found"
            })
        }
        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId && p.size === size && p.color === color);

        if (productIndex > -1) {
            //update quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity
            } else {
                cart.products.splice(productIndex, 1); //remove prod if quan is 0
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
}