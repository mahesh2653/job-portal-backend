import { Router } from "express";
import UserController from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/", UserController.registerUser);

userRouter.get("/", UserController.getAllUsers);

userRouter.post("/login", UserController.loginUser);

export default userRouter;
