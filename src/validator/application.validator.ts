import Joi from "joi";

const applicationSchema = Joi.object({
  jobId: Joi.string().required(),
  userId: Joi.string().required,
  status: Joi.string()
    .optional()
    .custom(() => {
      return "PENDING";
    }),
});

export default applicationSchema;
