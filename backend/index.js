import express from "express"
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const port = 3001 || process.env.PORT;

connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to Backend of MEGAHIVE")
})

//API ROutes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.listen(port, () => {
    console.log(`App is Listening on PORT ${port}`);
})