import express from "express"
import { admin, protect } from "../middlewares/authMiddleware.js";
import { addUser, deleteUser, getAllUsers, updateUser } from "../controllers/adminController.js";

const adminRouter = express.Router();

//Get all Usera Admin only
adminRouter.get("/", protect, admin, getAllUsers);
adminRouter.post("/", protect, admin, addUser);
//Update User
adminRouter.put("/:id", protect, admin, updateUser);
adminRouter.delete("/:id", protect, admin, deleteUser);


export default adminRouter;