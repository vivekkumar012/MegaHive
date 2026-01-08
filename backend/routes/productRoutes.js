import express from "express"

import { createProduct, deleteProduct, updateProduct } from "../controllers/productController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const productRouter = express.Router();

productRouter.post("/", protect, admin, createProduct);
productRouter.post("/:id", protect, admin, updateProduct);
productRouter.delete("/:id", protect, admin, deleteProduct);

export default productRouter;