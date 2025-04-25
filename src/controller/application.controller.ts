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

      const getApplication = await ApplicationService.getOneApplicationByAny({
        jobId: validate.jobId,
        userId: validate.userId,
      });
      if (getApplication) {
        res.json(
          successResponse(200, "For this job you have already applied", null)
        );
        return;
      }
      await ApplicationService.createApplication(validate);
      res.json(successResponse(200, "Application send successfully", null));
    } catch (error) {
      next(error);
    }
  };

  static deleteApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const applicationId = req.params.id as string;

      await ApplicationService.deleteApplication(applicationId);

      res.json(successResponse(200, "Applicaiton deleted successfully", null));
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

  static updateApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await ApplicationService.updateApplication(
        req.params.id,
        req.body
      );

      res.json(successResponse(200, "Application Updated successfully", data));
    } catch (error) {
      next(error);
    }
  };
}

export default ApplicationController;
