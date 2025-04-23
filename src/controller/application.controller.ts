import { Request, Response, NextFunction } from "express";
import applicationSchema from "../validator/application.validator";
import successResponse from "../utils/successResponse";

class ApplicationController {
  static createApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validate = await applicationSchema.validateAsync(req.body);
      console.log(validate);
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
}

export default ApplicationController;
