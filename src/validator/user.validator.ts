import Joi from "joi";
import IRoles from "../types/role.type";

const userSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should be at least 2 characters",
    "string.max": "Name should not exceed 100 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password should be at least 6 characters long",
  }),

  role: Joi.string()
    .valid(...Object.values(IRoles))
    .required()
    .messages({
      "any.only": "Role must be a valid value",
      "string.empty": "Role is required",
    }),

  profile: Joi.string().required().messages({
    "string.empty": "Profile URL is required",
    "string.uri": "Profile must be a valid URL",
  }),

  mobileNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export default userSchema;
