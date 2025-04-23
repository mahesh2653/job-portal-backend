import { Router } from "express";
import JobController from "../controller/job.controller";

const jobRouter = Router();

jobRouter.post("/", JobController.createJob);

jobRouter.get("/", JobController.getJobs);

export default jobRouter;
