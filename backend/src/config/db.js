import mongoose from "mongoose";
import config from "./config.js";

export async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            family: 4
        });

        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        console.error("Full error:", error);
        process.exit(1);
    }
}