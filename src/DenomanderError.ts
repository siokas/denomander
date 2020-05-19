export class DenomanderError extends Error {
  public static getErrorMessages() {
    return {
      INVALID_RULE: "Invalid Rule",
      OPTION_NOT_FOUND: "Option not found!",
      COMMAND_NOT_FOUND: "Command not found!",
      REQUIRED_OPTION_NOT_FOUND: "Required option is not specified!",
      REQUIRED_VALUE_NOT_FOUND: "Required command value is not specified!",
      TOO_MANY_PARAMS: "You have passed too many parameters",
    };
  }
}
