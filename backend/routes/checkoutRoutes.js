import express from "express"
import { protect } from "../middlewares/authMiddleware.js";
import { createCheckOut, finalizeCheckOut, updatePayStatus } from "../controllers/checkoutController.js";

const checkoutRouter = express.Router();

//Create new checkout session
checkoutRouter.post("/", protect, createCheckOut);
//Update CheckOut to mark as paid after payment
checkoutRouter.put("/:id/pay", protect, updatePayStatus);
// convert to an order after payment
checkoutRouter.post("/:id/finalize", protect, finalizeCheckOut)


export default checkoutRouter;