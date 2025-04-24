import { Router } from "express";
import JobController from "../controller/job.controller";
import RBAC from "../middleware/auth.middleware";
import IRoles from "../types/role.type";

const { EMPLOYER, JOB_SEEKER } = IRoles;

const jobRouter = Router();

jobRouter.post("/", RBAC([IRoles.EMPLOYER]), JobController.createJob);

jobRouter.get("/", JobController.getJobs);

jobRouter.get("/employer/:id", JobController.getJobsByEmployer);

jobRouter.get("/:id", JobController.getJobById);

jobRouter.put("/:id", JobController.updateJob);

jobRouter.delete("/:id", JobController.deleteJob);

export default jobRouter;
