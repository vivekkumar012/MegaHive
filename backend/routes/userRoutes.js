import express from "express"
import { getProfile, login, register } from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", protect, getProfile);

export default userRouter;