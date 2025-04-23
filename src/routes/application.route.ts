import { Router } from "express";
import ApplicationController from "../controller/application.controller";

const applicationRouter = Router();

applicationRouter.get("/", ApplicationController.getAllApplication);

applicationRouter.post("/", ApplicationController.createApplication);

export default applicationRouter;
