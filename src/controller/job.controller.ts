import { Request, Response } from "express";
import JobService from "../services/job.service";
import { AuthRequest } from "../middleware/auth.middleware";
import successResponse from "../utils/successResponse";
import jobSchema from "../validator/jobs.validator";

export default class JobController {
  static createJob = async (req: AuthRequest, res: Response) => {
    try {
      const validate = await jobSchema.validateAsync(req.body);
      console.log(validate);
      const job = await JobService.createJob(validate);
      res
        .status(201)
        .json(successResponse(200, "Jobs created successfully", job));
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  };

  static getJobs = async (req: Request, res: Response) => {
    try {
      const filters = req.query as any;
      const result = await JobService.getAllJobs(filters);
      res.json(successResponse(200, "Get all jobs successfully", result));
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  };

  static updateJob = async (req: AuthRequest, res: Response) => {
    try {
      const job = await JobService.updateJob(req.params.id, req.body);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json(job);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  };

  static deleteJob = async (req: AuthRequest, res: Response) => {
    try {
      const job = await JobService.deleteJob(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
      res.json({ message: "Job deleted" });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  };
}
