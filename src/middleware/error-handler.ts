import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Error } from "mongoose";
import { MongoError } from "mongodb";
import { IApiErrors } from "../types/error.type";
import ApiError from "../utils/api-error";

function errorHandlingMiddleWare(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // API Error
  if (err instanceof ApiError) {
    res.status(err.status).json({ status: err.status, message: err.message });
    return;
  }

  // JOI Error
  if (err instanceof Joi.ValidationError) {
    type Obj = {
      label: string | number;
      msg: string;
    };
    const error: Array<Obj> = [];
    err.details.forEach((e) => {
      const data = {
        label: e.path[0],
        msg:
          e.type === "any.custom" && e.context ? e.context.message : e.message,
      };
      error.push(data);
    });
    res
      .status(422)
      .json({ status: 422, message: "Validation Error", errors: error });
    return;
  }

  // Mongoose errors
  if (err instanceof Error.ValidationError) {
    const messages = Object.values(err.errors).map((err1) => err1.message);

    res.status(400).json({
      success: false,
      message: "Could not create user due to some invalid fields!",
      error: messages,
    });
    return;
  }
  if (err instanceof Error.DocumentNotFoundError) {
    res.status(404).json({ status: 404, message: "Document not found" });
    return;
  }
  if (err instanceof Error.CastError) {
    res.status(400).json({ status: 400, message: "Invalid ID" });
    return;
  }
  if ((err as MongoError).code === 11000) {
    res.status(400).json({
      message: `${JSON.parse(JSON.stringify((err as MongoError).message))}`,
    });
    return;
  }

  // Send Internal Sever Error
  res
    .status(500)
    .json({ status: 500, message: IApiErrors.INTERNAL_SERVER_ERROR });
}
export default errorHandlingMiddleWare;
