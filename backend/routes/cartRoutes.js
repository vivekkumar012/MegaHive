import express from "express";
import { createCart, deleteCartItem, updateQuantityCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

//Add a product to the cart as a guest or as a logged in user
cartRouter.post("/", createCart);
//Update product quantity in the cart for a guest or a user
cartRouter.put("/", updateQuantityCart);
cartRouter.delete("/", deleteCartItem);

export default cartRouter;