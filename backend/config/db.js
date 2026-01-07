import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DataBase is Connected");
    } catch (error) {
        console.log("MongoDB Connection Failed", error);
    }
}

export default connectDB;