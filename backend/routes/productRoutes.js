import express from "express"

import { createProduct, deleteProduct, getCategoryProduct, getHigherRatedProduct, getNewArrival, getProduct, getQueryProduct, updateProduct } from "../controllers/productController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const productRouter = express.Router();

productRouter.post("/", protect, admin, createProduct);
productRouter.post("/:id", protect, admin, updateProduct);
productRouter.delete("/:id", protect, admin, deleteProduct);
//Get all the products with query parameters
productRouter.get("/", getQueryProduct);
//Get Products with Higher ratings
productRouter.get("/best-seller", getHigherRatedProduct);
//Get the latest 8 products which is created new acc to date
productRouter.get("/new-arrival", getNewArrival);


productRouter.get("/similar/:id", getCategoryProduct);
productRouter.get("/:id", getProduct);


export default productRouter;