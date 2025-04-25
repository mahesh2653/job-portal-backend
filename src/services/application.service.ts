import ApplicationModel from "../model/application.model";
import IApplication from "../types/application.type";
import mongoose from "mongoose";
import { IApplicationStatus } from "../types/jobs.type";
import JobModel from "../model/jobs.model";

export default class ApplicationService {
  // Create a new application
  static createApplication = async (data: IApplication) => {
    const application = await ApplicationModel.create(data);
    return application;
  };

  // Get application by ID
  static getApplication = async (id: string) => {
    const application = await ApplicationModel.findById(id)
      .populate("jobId", "title company")
      .populate("userId", "name email");
    return application;
  };

  // Get all applications for a job seeker
  static getJobSeekerApplications = async (userId: string) => {
    const applications = await ApplicationModel.find({ userId })
      .populate("jobId", "title company")
      .lean();
    return applications;
  };

  // Get all applications for employer based on postedBy in job
  static getEmployerApplications = async (postedBy: string) => {
    const applications = await ApplicationModel.find()
      .populate({
        path: "jobId",
        match: { postedBy: new mongoose.Types.ObjectId(postedBy) },
        select: "title company",
      })
      .populate("userId", "name email")
      .lean();
    return applications.filter((app) => app.jobId);
  };

  // Get all applications (optionally filterable)
  static getApplicationsByAny = async (filter: object = {}) => {
    const applications = await ApplicationModel.find(filter)
      .populate("jobId", "title company")
      .populate("userId", "name email")
      .lean();
    return applications;
  };

  static getOneApplicationByAny = async (filter: object) => {
    const application = await ApplicationModel.findOne(filter).lean();
    return application;
  };
  // Update an application
  static updateApplication = async (
    id: string,
    data: Partial<IApplication>
  ) => {
    const application = await ApplicationModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return application;
  };

  // Delete an application
  static deleteApplication = async (id: string) => {
    const application = await ApplicationModel.findByIdAndDelete(id);
    return application;
  };

  static deleteApplicationByJobId = async (jobId: string) => {
    const application = await ApplicationModel.deleteMany({ jobId });
    return application;
  };

  // Dashboard summary: Total applications, status breakdown
  static getDashboardStats = async (postedBy: string) => {
    const matchPostedJobs = {
      $lookup: {
        from: "application",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    };

    const unwindJob = { $unwind: "$job" };
    const matchPostedBy = {
      $match: { "job.postedBy": new mongoose.Types.ObjectId(postedBy) },
    };

    const groupByStatus = {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    };

    const totalApplications = await ApplicationModel.aggregate([
      matchPostedJobs,
      unwindJob,
      matchPostedBy,
      groupByStatus,
    ]);

    const formattedStats = totalApplications.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    const total = totalApplications.reduce((sum, curr) => sum + curr.count, 0);

    return {
      totalApplications: total,
      statusBreakdown: formattedStats,
    };
  };

  static getApplicationStatsForPostedJobs = async (userId: string) => {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const stats = await ApplicationModel.aggregate([
      {
        $lookup: {
          from: "jobs", // collection name in MongoDB (make sure it's correct)
          localField: "jobId",
          foreignField: "_id",
          as: "jobInfo",
        },
      },
      { $unwind: "$jobInfo" }, // deconstruct the jobInfo array

      // Filter only jobs where postedBy = current userId
      {
        $match: {
          "jobInfo.postedBy": objectUserId,
        },
      },

      // Group by application status
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format stats for consistent output
    const formattedStats = stats.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      { PENDING: 0, ACCEPTED: 0, REJECTED: 0 }
    );

    return formattedStats;
  };

  // static getApplicationsWithStatsForPostedJobs = async (userId: string) => {
  //   const objectUserId = new mongoose.Types.ObjectId(userId);

  //   const result = await ApplicationModel.aggregate([
  //     {
  //       $lookup: {
  //         from: "jobs",
  //         localField: "jobId",
  //         foreignField: "_id",
  //         as: "jobInfo",
  //       },
  //     },
  //     { $unwind: "$jobInfo" },

  //     // Filter to include only applications to jobs posted by the given user
  //     {
  //       $match: {
  //         "jobInfo.postedBy": objectUserId,
  //       },
  //     },

  //     // Join with User collection to get applicant details
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "userInfo",
  //       },
  //     },
  //     { $unwind: "$userInfo" },

  //     {
  //       $project: {
  //         _id: 0,
  //         name: "$userInfo.name",
  //         email: "$userInfo.email",
  //         message: 1,
  //         status: 1,
  //         createdAt: 1,
  //         companyName: "$jobInfo.company",
  //         title: "$jobInfo.title",
  //       },
  //     },
  //   ]);

  //   // Status statistics
  //   const stats = result.reduce(
  //     (acc, curr) => {
  //       acc[curr.status] = (acc[curr.status] || 0) + 1;
  //       return acc;
  //     },
  //     { PENDING: 0, ACCEPTED: 0, REJECTED: 0 }
  //   );

  //   // Total jobs posted by this user
  //   const total = await JobModel.countDocuments({ postedBy: objectUserId });

  //   return {
  //     total,
  //     stats,
  //     applications: result, // Each application is now a clean object
  //   };
  // };

  // Get application stats for a specific user

  static getApplicationsWithStatsForPostedJobs = async (userId: string) => {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const result = await ApplicationModel.aggregate([
      // Join with Job collection
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobInfo",
        },
      },
      {
        $unwind: "$jobInfo",
      },

      // Filter to include only applications to jobs posted by the given user
      {
        $match: {
          "jobInfo.postedBy": objectUserId,
        },
      },

      // Join with User collection to get applicant details
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $unwind: "$userInfo",
      },

      // Project only necessary fields (optional - adjust as needed)
      {
        $project: {
          _id: 1,
          message: 1,
          status: 1,
          createdAt: 1,
          job: "$jobInfo",
          applicant: "$userInfo",
        },
      },
    ]);

    // Optionally, generate stats based on status
    const stats = result.reduce(
      (acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      },
      { PENDING: 0, ACCEPTED: 0, REJECTED: 0 }
    );

    const total = await JobModel.countDocuments({ postedBy: objectUserId });
    return {
      total,
      applications: result,
      stats,
    };
  };
  static getApplicationStatsByUser = async (userId: string) => {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    // 1. Application stats by status
    const stats = await ApplicationModel.aggregate([
      {
        $match: { userId: objectUserId },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = stats.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      { PENDING: 0, ACCEPTED: 0, REJECTED: 0 }
    );

    // 2. Total count of applications
    const total = await ApplicationModel.countDocuments({
      userId: objectUserId,
    });

    // 3. All applications with job details (title and company)
    const applications = await ApplicationModel.find({ userId: objectUserId })
      .populate("jobId", "title company") // populate job title and company
      .populate("userId", "name email"); // optional: include user info too

    return {
      stats: {
        total,
        ...formattedStats,
      },
      applications,
    };
  };
}
