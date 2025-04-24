import { NextFunction, Request, Response } from "express";
import JobService from "../services/job.service";
import { AuthRequest } from "../middleware/auth.middleware";
import successResponse from "../utils/successResponse";
import jobSchema from "../validator/jobs.validator";
import ApiError from "../utils/api-error";
import ApplicationService from "../services/application.service";

export default class JobController {
  static createJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validate = await jobSchema.validateAsync({
        ...req.body,
      });
      const job = await JobService.createJob({
        ...validate,
      });
      res
        .status(201)
        .json(successResponse(201, "Job created successfully", job));
    } catch (err) {
      next(err);
    }
  };

  static getJobById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await JobService.getJob(req.params.id);

      if (!job) return next(ApiError.customError(404, "Job not found"));
      res.json(successResponse(200, "Job fetched successfully", job));
    } catch (err) {
      next(err);
    }
  };

  static getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = {
        ...req.query,
      };
      const result = await JobService.getAllJobs(filters);
      res.json(successResponse(200, "Jobs fetched successfully", result));
    } catch (err) {
      next(err);
    }
  };

  static getAllJobById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  static updateJob = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await JobService.updateJob(req.params.id, req.body);
      if (!job) return next(ApiError.customError(404, "Job not found"));
      res.json(successResponse(200, "Job updated successfully", job));
    } catch (err) {
      next(err);
    }
  };

  static deleteJob = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jobId = req.params.id as string;
      const job = await JobService.deleteJob(jobId);
      await ApplicationService.deleteApplicationByJobId(jobId);
      if (!job) return next(ApiError.customError(404, "Job not found"));
      res.json(successResponse(200, "Job deleted successfully", null));
    } catch (err) {
      next(err);
    }
  };

  static bulkAddJob = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jobs = await JobService.bulkCreate(req.body.data);
      res.status(201).json(successResponse(201, "Bulk jobs added", jobs));
    } catch (err) {
      next(err);
    }
  };

  static getJobsByEmployer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await ApplicationService.getApplicationStatsForPostedJobs(
        req.params.id
      );

      res.json(successResponse(200, "Jobs fetched successfully", job));
    } catch (err) {
      next(err);
    }
  };
}
