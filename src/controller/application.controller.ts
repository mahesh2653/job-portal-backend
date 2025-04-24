import { Request, Response, NextFunction } from "express";
import applicationSchema from "../validator/application.validator";
import successResponse from "../utils/successResponse";
import ApplicationService from "../services/application.service";

class ApplicationController {
  static createApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validate = await applicationSchema.validateAsync(req.body);
      const getApplication = await ApplicationService.getApplicationsByAny({
        jobId: validate.jobId,
        userId: validate.userId,
      });
      if (getApplication) {
        res.json(
          successResponse(200, "For this job you have already applied", null)
        );
        return;
      }
      const data = await ApplicationService.createApplication(validate);
      res.json(successResponse(200, "Application done", null));
    } catch (error) {
      next(error);
    }
  };

  static getAllApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.json(successResponse(200, "Get all application successfully", null));
    } catch (error) {
      next(error);
    }
  };

  static saveJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobId as string;

      // const updateSave = await ApplicationService.createApplication({});
    } catch (error) {
      next(error);
    }
  };
}

export default ApplicationController;
