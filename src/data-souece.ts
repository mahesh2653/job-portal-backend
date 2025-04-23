import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URI || "";

const connectionDB = async () => {
  await mongoose.connect(url);
  return mongoose.connection;
};

export default connectionDB;
