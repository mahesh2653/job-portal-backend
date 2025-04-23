import JobModel from "../model/jobs.model";
import IJob, { ICategory, IJobType } from "../types/jobs.type";

export default class JobService {
  // Create a new job
  static createJob = async (data: IJob) => {
    const job = await JobModel.create(data);
    return job;
  };

  // Get a job by ID
  static getJob = async (id: string) => {
    const job = await JobModel.findById(id).populate(
      "postedBy",
      "name company"
    );
    return job;
  };

  // Get all jobs with optional filters and pagination
  static getAllJobs = async (
    filters: {
      search?: string;
      location?: string;
      jobType?: IJobType;
      category?: ICategory;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const {
      search,
      location,
      jobType,
      category,
      page = 1,
      limit = 10,
    } = filters;
    const query: any = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (category) query.category = category;

    const jobs = await JobModel.find(query)
      .populate("postedBy", "name company")
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await JobModel.countDocuments(query);
    return { jobs, total, page, pages: Math.ceil(total / limit) };
  };

  // Get jobs by postedBy (employer)
  static getJobsByPostedBy = async (postedBy: string) => {
    const jobs = await JobModel.find({ postedBy })
      .populate("postedBy", "name company")
      .lean();
    return jobs;
  };

  // Update a job by ID
  static updateJob = async (id: string, data: Partial<IJob>) => {
    const job = await JobModel.findByIdAndUpdate(id, data, { new: true });
    return job;
  };

  // Delete a job by ID
  static deleteJob = async (id: string) => {
    const job = await JobModel.findByIdAndDelete(id);
    return job;
  };

  static getJobsByAny = async (filter: object) => {
    const jobs = await JobModel.find(filter)
      .populate("postedBy", "name company")
      .lean();
    return jobs;
  };
}
