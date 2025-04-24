import Joi from "joi";
import { ICategory, IJobType } from "../types/jobs.type";

const jobSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must be at most 100 characters",
  }),

  description: Joi.string().min(20).max(1000).required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
    "string.min": "Description must be at least 20 characters",
    "string.max": "Description must be at most 1000 characters",
  }),

  company: Joi.string().min(3).max(100).required(),
  companyInfo: Joi.string().min(3).max(100).required(),

  location: Joi.string().min(3).max(100).required(),

  jobType: Joi.string()
    .valid(...Object.values(IJobType))
    .required()
    .messages({
      "any.only": "Invalid job type",
    }),

  category: Joi.string()
    .valid(...Object.values(ICategory))
    .required()
    .messages({
      "any.only": "Invalid category",
    }),

  postedBy: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid postedBy ObjectId",
    }),

  salary: Joi.object({
    from: Joi.number().greater(0).required().messages({
      "number.base": "Salary 'from' must be a number",
      "number.greater": "Salary 'from' must be greater than 0",
    }),
    to: Joi.number().required().greater(Joi.ref("from")).messages({
      "number.greater": "Salary 'to' must be greater than 'from'",
      "number.base": "Salary 'to' must be a number",
    }),
  }).required(),
});

export default jobSchema;
