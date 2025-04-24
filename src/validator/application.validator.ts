import Joi from "joi";
import { IApplicationStatus } from "../types/jobs.type";

const applicationSchema = Joi.object({
  jobId: Joi.string().required(),
  userId: Joi.string().required(),
  message: Joi.string().required(),
  status: Joi.string()
    .optional()
    .valid(...Object.values(IApplicationStatus))
    .custom(() => {
      return IApplicationStatus.PENDING;
    }),
});

export default applicationSchema;
