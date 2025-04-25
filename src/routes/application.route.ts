import { Router } from "express";
import ApplicationController from "../controller/application.controller";

const applicationRouter = Router();

applicationRouter.get("/", ApplicationController.getAllApplication);

applicationRouter.post("/", ApplicationController.createApplication);

applicationRouter.put("/:id", ApplicationController.updateApplication);

applicationRouter.delete("/:id", ApplicationController.deleteApplication);

export default applicationRouter;
