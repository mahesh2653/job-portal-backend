import mongoose from "mongoose";

interface IJob {
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: string;
  category: string;
  postedBy: mongoose.Types.ObjectId;
  companyInfo: string;
  salary: { from: string; to: string };
}

export enum IJobType {
  FULL_TIME = "FULL-TIME",
  PART_TIME = "PART-TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
}

export enum ICategory {
  ENGINEERING = "ENGINEERING",
  DESIGN = "DESIGN",
  MARKETING = "MARKETING",
  SALES = "SALES",
  FINANCE = "FINANCE",
  HUMAN_RESOURCES = "HUMAN_RESOURCES",
  PRODUCT_MANAGEMENT = "PRODUCT_MANAGEMENT",
  CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
  OPERATIONS = "OPERATIONS",
}

export enum IApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  HOLD = "HOLD",
}

export default IJob;
