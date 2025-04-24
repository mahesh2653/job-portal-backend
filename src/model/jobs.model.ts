import mongoose from "mongoose";
import IJob, { IJobType } from "../types/jobs.type";
import { required } from "joi";

const jobSchema = new mongoose.Schema<IJob>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    company: { type: String, required: true },
    companyInfo: { type: String, required: true },
    description: { type: String, required: true },
    jobType: { type: String, required: true, default: IJobType.FULL_TIME },
    location: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    salary: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const JobModel = mongoose.model("jobs", jobSchema);

export default JobModel;
