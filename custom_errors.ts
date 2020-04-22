import * as CustomError from "./src/errors.ts";

const INVALID_RULE_MESSAGE = "Invalid Rule";
const ARG_NOT_FOUND_MESSAGE = "Argument {0} not found in available commands!";
const REQUIRED_OPTIONS_NOT_FOUND_MESSAGE =
  "Required option {0} is not specified!";
const REQUIRED_VALUE_NOT_FOUND_MESSAGE =
  "Required value for command {0} is not specified!";

export const VALIDATION_INVALID_RULE: Error = new CustomError.ValidationError(
  INVALID_RULE_MESSAGE,
);
export const VALIDATION_ARG_NOT_FOUND: Error = new CustomError.ValidationError(
  ARG_NOT_FOUND_MESSAGE,
);
export const VALIDATION_REQUIRED_OPTIONS_NOT_FOUND: Error = new CustomError
  .ValidationError(REQUIRED_OPTIONS_NOT_FOUND_MESSAGE);
export const VALIDATION_REQUIRED_VALUE_NOT_FOUND: Error = new CustomError
  .ValidationError(REQUIRED_VALUE_NOT_FOUND_MESSAGE);
