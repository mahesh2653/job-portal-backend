import { Request, Response, NextFunction } from "express";
import hashPassword, { verifyPassword } from "../utils/hashPassword";
import UserService from "../services/user.service";
import userSchema, { loginSchema } from "../validator/user.validator";
import jwt from "jsonwebtoken";
import checkEnvVariable from "../utils/checkEnvVariable";
import ApiError from "../utils/api-error";
import ApplicationService from "../services/application.service";
import successResponse from "../utils/successResponse";

export default class UserController {
  static registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Validate incoming request data
      const validatedData = await userSchema.validateAsync(req.body);
      const { email, password } = validatedData;

      // Check if user already exists
      const existingUser = await UserService.getOneUserByAny({ email });
      if (existingUser) {
        next(ApiError.customError(409, "User already exists"));
        return;
      }

      // Hash password and create new user
      const newUser = await UserService.createUser({
        ...validatedData,
        password: await hashPassword(password),
      });

      if (!newUser) {
        res.status(400).json({
          status: 400,
          message: "Error while creating user",
        });
        return;
      }

      // Successful response
      res.status(201).json({
        status: 201,
        message: "User registered successfully",
        data: newUser,
      });
    } catch (error) {
      // Forward error to error handler middleware
      next(error);
    }
  };
  static loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validate = await loginSchema.validateAsync(req.body);

      const { email, password } = validate;

      const userData = await UserService.getOneUserByAny({ email });
      if (!userData) {
        next(ApiError.customError(404, "User Not found"));
        return;
      }
      if (!userData) {
        throw Error("Before login register first ");
      }
      const { name, _id } = userData;
      const value = await verifyPassword(password, userData.password);
      if (!value) {
        res
          .status(403)
          .json({ status: 403, message: "Invalid email and password" });
        return;
      }

      const payload = {
        email,
        name: name,
        username: userData.email,
        id: _id,
        role: userData.role,
        profile: userData.profile,
      };

      const token = jwt.sign(payload, checkEnvVariable("JWT_SECRET"), {
        expiresIn: "1h",
      });

      const user = {
        email: userData.email,
        name: name,
        role: userData.role,
        username: userData.email,
        id: _id,
      };

      res.json({
        status: 200,
        message: "User login successfully",
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  };

  static authUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw Error("Token not found");
      }
      const decoded = jwt.verify(token, checkEnvVariable("JWT_SECRET"));
      res.json({
        status: 200,
        message: "User is authenticated",
        data: decoded,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const users = await UserService.getAllUsers();
      res.json({
        status: 200,
        message: "All users",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  static getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id as string;
      const data = await ApplicationService.getApplicationStatsByUser(userId);
      res.json(successResponse(200, "Get applicaiton data successfully", data));
    } catch (error) {
      next(error);
    }
  };
}
