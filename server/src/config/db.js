import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = (process.env.MONGO_URI).replace("[PASSWORD]", process.env.DB_PASSWORD);
    if (!uri) throw new Error("MONGO_URI is missing in environment variables");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
