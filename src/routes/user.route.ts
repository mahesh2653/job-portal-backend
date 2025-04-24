import { Router } from "express";
import UserController from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/register", UserController.registerUser);

userRouter.get("/", UserController.getAllUsers);

userRouter.post("/login", UserController.loginUser);

userRouter.get("/auth", UserController.authUser);

userRouter.get("/:id", UserController.getUserById);

export default userRouter;
