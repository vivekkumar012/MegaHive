import express from "express";
import { createCart, deleteCartItem, getCartProduct, mergeCart, updateQuantityCart } from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const cartRouter = express.Router();

//Add a product to the cart as a guest or as a logged in user
cartRouter.post("/", createCart);
//Update product quantity in the cart for a guest or a user
cartRouter.put("/", updateQuantityCart);
cartRouter.delete("/", deleteCartItem);
cartRouter.get("/", getCartProduct);

//Merge Guest cart into UserCart on Login
cartRouter.post("/merge", protect, mergeCart);

export default cartRouter;