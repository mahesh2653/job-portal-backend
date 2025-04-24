import { Router } from "express";
import userRouter from "./user.route";
import jobRouter from "./jobs.route";
import applicationRouter from "./application.route";

const routerApi = Router();

const allRoutes = [
  {
    name: "/users",
    route: userRouter,
  },
  {
    name: "/jobs",
    route: jobRouter,
  },
  {
    name: "/applications",
    route: applicationRouter,
  },
];

allRoutes.forEach(({ name, route }) => {
  routerApi.use(name, route);
});

export default routerApi;
