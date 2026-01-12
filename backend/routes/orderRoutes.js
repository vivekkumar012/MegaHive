import express from "express"
import { protect } from "../middlewares/authMiddleware.js";
import { getAllOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

//Get Loggedin User's orders
orderRouter.post("/my-orders", protect, getAllOrders);


export default orderRouter;