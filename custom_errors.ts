enum ErrorMessage {
  INVALID_RULE = "Invalid Rule",
  ARG_NOT_FOUND = "Argument not found in available commands!",
  REQUIRED_OPTION_NOT_FOUND = "Required option is not specified!",
  REQUIRED_VALUE_NOT_FOUND = "Required command value is not specified!",
  TOO_MANY_PARAMS = "You have passed too many parameters",
}

export class ValidationError extends Error {
  public message: string;
  constructor(message: string) {
    super(message);

    this.message = message;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export const VALIDATION_INVALID_RULE: Error = new ValidationError(
  ErrorMessage.INVALID_RULE,
);
export const VALIDATION_ARG_NOT_FOUND: Error = new ValidationError(
  ErrorMessage.ARG_NOT_FOUND,
);
export const VALIDATION_REQUIRED_OPTIONS_NOT_FOUND: Error = new ValidationError(
  ErrorMessage.REQUIRED_OPTION_NOT_FOUND,
);
export const VALIDATION_REQUIRED_VALUE_NOT_FOUND: Error = new ValidationError(
  ErrorMessage.REQUIRED_VALUE_NOT_FOUND,
);
export const VALIDATION_TOO_MANY_PARAMS: Error = new ValidationError(
  ErrorMessage.TOO_MANY_PARAMS,
);
