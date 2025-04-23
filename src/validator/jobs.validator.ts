import { ICategory, IJobType } from "../types/jobs.type";

import Joi from "joi";

const jobSchema = Joi.object({
  title: Joi.string().required(),
  category: Joi.string()
    .valid(...Object.values(ICategory))
    .required(),
  company: Joi.string().required(),
  description: Joi.string().required(),
  jobType: Joi.string()
    .valid(...Object.values(IJobType))
    .required(),
  location: Joi.string().required(),
  postedBy: Joi.string().hex().length(24).optional(), // MongoDB ObjectId
});

export default jobSchema;
