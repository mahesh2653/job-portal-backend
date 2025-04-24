import mongoose from "mongoose";
import ApplicationModel from "../model/application.model";
import JobModel from "../model/jobs.model";
import IJob, { ICategory, IJobType } from "../types/jobs.type";

export default class JobService {
  // Create a new job
  static createJob = async (data: IJob) => {
    return await JobModel.create(data);
  };

  // Bulk insert jobs
  static bulkCreate = async (data: IJob[]) => {
    return await JobModel.insertMany(data);
  };

  // Get a job by ID with employer info
  static getJob = async (id: string) => {
    return await JobModel.findById(id).populate("postedBy", "name company");
  };

  // Get all jobs with optional search, filters, and pagination
  static getAllJobs2 = async (
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

    // Regex-based search on multiple fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

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

  // Get all jobs with optional search, filters, and pagination
  static getAllJobs = async (
    filters: {
      search?: string;
      location?: string;
      jobType?: IJobType;
      category?: ICategory;
      postedBy?: string; // <-- Add this line
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const {
      search,
      location,
      jobType,
      category,
      postedBy, // <-- Extract postedBy
      page = 1,
      limit = 10,
    } = filters;

    const query: any = {};

    // Regex-based search on multiple fields
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (location) query.location = { $regex: location, $options: "i" };
    if (jobType) query.jobType = jobType;
    if (category) query.category = category;
    if (postedBy) query.postedBy = postedBy; // <-- Filter by user ID

    const jobs = await JobModel.find(query)
      .populate("postedBy", "name company")
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await JobModel.countDocuments(query);

    return {
      jobs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  };

  // Get jobs by a specific employer
  static getJobsByPostedBy = async (postedBy: string) => {
    return await JobModel.find({ postedBy })
      .populate("postedBy", "name company")
      .lean();
  };

  // Get jobs by dynamic filters
  static getJobsByAny = async (filter: object) => {
    return await JobModel.find(filter)
      .populate("postedBy", "name company")
      .lean();
  };

  // Update a job
  static updateJob = async (id: string, data: Partial<IJob>) => {
    return await JobModel.findByIdAndUpdate(id, data, { new: true });
  };

  // Delete a job
  static deleteJob = async (id: string) => {
    return await JobModel.findByIdAndDelete(id);
  };

  // Search jobs by keyword across multiple fields
  static searchJobs = async (keyword: string) => {
    return await JobModel.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    })
      .populate("postedBy", "name company")
      .lean();
  };

  static getJobsWithApplicationStats = async (postedBy: string) => {
    // Perform a single aggregation pipeline
    const pipeline = [
      // Step 1: Match jobs by postedBy
      {
        $match: {
          postedBy: new mongoose.Types.ObjectId(postedBy),
        },
      },
      // Step 2: Lookup applications for these jobs
      {
        $lookup: {
          from: ApplicationModel.collection.name,
          localField: "_id",
          foreignField: "job",
          as: "applications",
        },
      },
      // Step 3: Populate postedBy user details
      {
        $lookup: {
          from: "users", // Adjust to your User model's collection name
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy",
        },
      },
      // Step 4: Unwind postedBy to get a single object
      {
        $unwind: {
          path: "$postedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Step 5: Project fields and compute application stats
      {
        $project: {
          title: 1,
          // Include other job fields as needed
          postedBy: {
            name: "$postedBy.name",
            company: "$postedBy.company",
          },
          applicationStats: {
            $reduce: {
              input: "$applications",
              initialValue: { pending: 0, viewed: 0, rejected: 0 },
              in: {
                pending: {
                  $add: [
                    "$$value.pending",
                    { $cond: [{ $eq: ["$$this.status", "pending"] }, 1, 0] },
                  ],
                },
                viewed: {
                  $add: [
                    "$$value.viewed",
                    { $cond: [{ $eq: ["$$this.status", "viewed"] }, 1, 0] },
                  ],
                },
                rejected: {
                  $add: [
                    "$$value.rejected",
                    { $cond: [{ $eq: ["$$this.status", "rejected"] }, 1, 0] },
                  ],
                },
              },
            },
          },
        },
      },
    ];

    // Execute the aggregation
    const jobsWithStats = await JobModel.aggregate(pipeline).exec();

    return jobsWithStats;
  };

  static getDashboardCounts = async (postedBy: string) => {
    const pipeline = [
      // Step 1: Match jobs by postedBy
      {
        $match: {
          postedBy,
        },
      },
      // Step 2: Lookup applications for these jobs
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        },
      },
      // Step 3: Unwind applications to count them individually
      {
        $unwind: {
          path: "$applications",
          preserveNullAndEmptyArrays: true, // Include jobs with no applications
        },
      },
      // Step 4: Group to count jobs, applications, and status
      {
        $group: {
          _id: null,
          totalJobs: { $sum: 1 }, // Count all jobs
          totalApplications: {
            $sum: { $cond: [{ $ne: ["$applications", {}] }, 1, 0] },
          }, // Count non-empty applications
          applicationStats: {
            $push: {
              $cond: [
                { $ne: ["$applications", {}] },
                { status: "$applications.status", count: 1 },
                null,
              ],
            },
          },
        },
      },
      // Step 5: Transform applicationStats into an object
      {
        $project: {
          _id: 0,
          totalJobs: 1,
          totalApplications: 1,
          applicationStats: {
            $arrayToObject: {
              $map: {
                input: {
                  $filter: { input: "$applicationStats", cond: "$$this" },
                }, // Remove nulls
                as: "stat",
                in: {
                  k: "$$stat.status",
                  v: { $sum: "$$stat.count" },
                },
              },
            },
          },
        },
      },
      // Step 6: Ensure default stats for all statuses
      {
        $project: {
          totalJobs: 1,
          totalApplications: 1,
          applicationStats: {
            $mergeObjects: [
              { pending: 0, accepted: 0, rejected: 0 },
              "$applicationStats",
            ],
          },
        },
      },
    ];

    // Execute the aggregation
    const [result] = await JobModel.aggregate(pipeline).exec();

    // Return default counts if no jobs exist
    return (
      result || {
        totalJobs: 0,
        totalApplications: 0,
        applicationStats: { pending: 0, accepted: 0, rejected: 0 },
      }
    );
  };
}
