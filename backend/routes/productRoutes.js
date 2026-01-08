import express from "express"

import { createProduct } from "../controllers/productController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const productRouter = express.Router();

productRouter.post("/", protect, admin, createProduct);


export default productRouter;