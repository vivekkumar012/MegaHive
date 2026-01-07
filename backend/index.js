import express from "express"
import cors from "cors";
import dotenv from "dotenv"

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const port = 3001 || process.env.PORT;

app.get("/", (req, res) => {
    res.send("Welcome to Backend of MEGAHIVE")
})

app.listen(port, () => {
    console.log(`App is Listening on PORT${port}`);
})