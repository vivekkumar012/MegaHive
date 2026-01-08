import mongoose from "mongoose";
import dotenv from "dotenv"
import { productModel } from "./models/productModel.js";
import { userModel } from "./models/userModel.js";
import products from "./data/products.js";


dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    try {
        //clear existing data
        await productModel.deleteMany();
        await userModel.deleteMany();

        //create a default admin user
        const createdUser = await userModel.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "12345678",
            role: "admin"
        })

        //Assigned userId for each Products
        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user:userID }
        });

        //Insert Products into DB
        await productModel.insertMany(sampleProducts);
        console.log("Product data seeded successfully");
        process.exit();

    } catch (error) {
        console.log("Error while seeding the data", error);
        process.exit(1);
    }
}

seedData();