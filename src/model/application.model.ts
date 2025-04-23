import mongoose from "mongoose";
import IApplication from "../types/application.type";

const applicaiotnSchema = new mongoose.Schema<IApplication>(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String },
    message: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const ApplicationModel = mongoose.model("application", applicaiotnSchema);

export default ApplicationModel;
