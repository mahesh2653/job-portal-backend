import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../model/user.model";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    req.user = await UserModel.findById(decoded.id);
    if (!req.user) throw new Error("User not found");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const roleMiddleware =
  (role: "employer" | "job_seeker") =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role)
      return res.status(403).json({ message: "Access denied" });
    next();
  };
