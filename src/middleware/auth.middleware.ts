import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../model/user.model";
import ApiError from "../utils/api-error";

// Single middleware that authenticates and checks roles
const RBAC = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      next(ApiError.unAuthorized());
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      const user = await UserModel.findById(decoded.id);
      if (!user) {
        next(ApiError.customError(404, "User not found"));
        return;
      }

      // Check if user role is allowed
      if (!allowedRoles.includes(user.role)) {
        next(ApiError.forbidden());
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default RBAC;
