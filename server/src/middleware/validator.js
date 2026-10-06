import { body, validationResult } from "express-validator";
import { ValidationError } from "../utils/errorClasses.js";

export const emailValidator = body("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage("Invalid email format");

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().reduce((acc, err) => {
      acc[err.param] = err.msg;
      return acc;
    }, {});
    return next(new ValidationError("Validation failed", details));
  }
  next();
};

export default {
  emailValidator,
  validate,
};
