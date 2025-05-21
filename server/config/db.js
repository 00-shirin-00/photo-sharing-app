import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // رشته اتصال به MongoDB لوکال شما
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/photoAppDB";

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB succes: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
