import * as CustomError from "./src/errors.ts";

enum ErrorMessage {
  INVALID_RULE = "Invalid Rule",
  ARG_NOT_FOUND = "Argument not found in available commands!",
  REQUIRED_OPTION_NOT_FOUND = "Required option is not specified!",
  REQUIRED_VALUE_NOT_FOUND = "Required command value is not specified!",
}

export const VALIDATION_INVALID_RULE: Error = new CustomError.ValidationError(
  ErrorMessage.INVALID_RULE,
);
export const VALIDATION_ARG_NOT_FOUND: Error = new CustomError.ValidationError(
  ErrorMessage.ARG_NOT_FOUND,
);
export const VALIDATION_REQUIRED_OPTIONS_NOT_FOUND: Error = new CustomError
  .ValidationError(ErrorMessage.REQUIRED_OPTION_NOT_FOUND);
export const VALIDATION_REQUIRED_VALUE_NOT_FOUND: Error = new CustomError
  .ValidationError(ErrorMessage.REQUIRED_VALUE_NOT_FOUND);
