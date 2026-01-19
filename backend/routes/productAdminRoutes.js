import express from "express"
import { admin, protect } from "../middlewares/authMiddleware.js";
import { getAllProducts } from "../controllers/adminProductController.js";


const productAdminRouter = express.Router();

//get all products (admin only)
productAdminRouter.get("/", protect, admin, getAllProducts);


export default productAdminRouter;