import mongoose from "mongoose";

interface IApplication {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  status: string;
  message: string;
}

export default IApplication;
