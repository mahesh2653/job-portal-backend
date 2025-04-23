import { Request, Response, NextFunction } from "express";
import hashPassword, { verifyPassword } from "../utils/hashPassword";
import UserService from "../services/user.service";
import userSchema, { loginSchema } from "../validator/user.validator";
import jwt from "jsonwebtoken";
import checkEnvVariable from "../utils/checkEnvVariable";
import ApiError from "../utils/api-error";

export default class UserController {
  static registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validate = await userSchema.validateAsync(req.body);
      const { password, email } = validate;

      const userData = await UserService.getUserByUserName(email);

      if (userData) {
        throw Error("User already exist");
      }

      const user = await UserService.createUser({
        ...validate,
        password: await hashPassword(password),
      });
      if (!user) {
        res.json({ status: 400, message: "error while creating a user" });
        return;
      }
      res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
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

      const userData = await UserService.getUserByUserName(email);
      if (!userData) {
        next(ApiError.customError(404, "User Not found"));
        return;
      }
      if (!userData) {
        throw Error("Before login register first ");
      }
      const { name, _id } = userData;

      const value = await verifyPassword(password, userData.password);
      if (!(await verifyPassword(password, userData.password))) {
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
}
