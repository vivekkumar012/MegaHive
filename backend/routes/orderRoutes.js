import express from "express"
import { protect } from "../middlewares/authMiddleware.js";
import { getAllOrders, getOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

//Get Loggedin User's orders
orderRouter.get("/my-orders", protect, getAllOrders);
orderRouter.get("/:id", protect, getOrder);


export default orderRouter;