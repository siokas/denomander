import { DenomanderError } from "./src/DenomanderError.ts";

export const VALIDATION_INVALID_RULE: Error = new Error(
  DenomanderError.getErrorMessages().INVALID_RULE,
);
export const VALIDATION_OPTION_NOT_FOUND: Error = new Error(
  DenomanderError.getErrorMessages().OPTION_NOT_FOUND,
);
export const VALIDATION_COMMAND_NOT_FOUND: Error = new Error(
  DenomanderError.getErrorMessages().COMMAND_NOT_FOUND,
);
export const VALIDATION_REQUIRED_OPTIONS_NOT_FOUND: Error = new Error(
  DenomanderError.getErrorMessages().REQUIRED_OPTION_NOT_FOUND,
);
export const VALIDATION_REQUIRED_VALUE_NOT_FOUND: Error = new Error(
  DenomanderError.getErrorMessages().REQUIRED_VALUE_NOT_FOUND,
);
export const VALIDATION_TOO_MANY_PARAMS: Error = new DenomanderError(
  DenomanderError.getErrorMessages().TOO_MANY_PARAMS,
);
