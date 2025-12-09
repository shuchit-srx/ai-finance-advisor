import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = (process.env.MONGO_URI).replace("[PASSWORD]", process.env.DB_PASSWORD);
    if (!uri) {
      throw new Error("MONGO_URI not set in environment");
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
