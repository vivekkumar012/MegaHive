import express from "express"
import { admin, protect } from "../middlewares/authMiddleware.js";
import { deleteOrderAdmin, getAllOrdersAdmin, updateOrderStatus } from "../controllers/adminOrderController.js";


const adminOrderRouter = express.Router();

//Get all orders(admin only)
adminOrderRouter.get("/", protect, admin, getAllOrdersAdmin);
//Update Order status
adminOrderRouter.put("/:id", protect, admin, updateOrderStatus);
adminOrderRouter.delete("/:id", protect, admin, deleteOrderAdmin);


export default adminOrderRouter;