import { Command } from "./Command.ts";
import { Kernel } from "./Kernel.ts";
import { Arguments } from "./Arguments.ts";

/**
 * Defines the app detail types
 * 
 * @export 
 * @type AppDetails
 */
export type AppDetails = {
  app_name: string;
  app_description: string;
  app_version: string;
};

/**
 * Defines the .on() command options.
 * 
 * @export 
 * @type OnCommand
 */
export type OnCommand = {
  command: Command;
  callback: Function;
};

/**
 * Defines the temporary on command options.
 * 
 * @export 
 * @type TempOnCommand
 */
export type TempOnCommand = {
  arg: string;
  callback: Function;
};

/**
 * Defines the Command object options
 * 
 * @export 
 * @type CommandOptions
 */
export type CommandOptions = {
  value: string;
  description?: string;
  is_required?: boolean;
  type?: "command" | "option";
  action?: Function;
};

/**
 * Defines the args
 * 
 * @export
 * @type CustomArgs
 */
export type CustomArgs = {
  [key: string]: string | Array<string>;
};

/**
 * Defines all the types of commands
 * 
 * @export
 * @type CommandTypes
 */
export type CommandTypes = {
  default_options: Array<Command>;
  required_options: Array<Command>;
  options: Array<Command>;
  commands: Array<Command>;
};

/**
 * Defines the validation result
 * 
 * @export
 * @type ValidationResult
 */
export type ValidationResult = {
  passed: boolean;
  error?: Error;
};

/**
 * Defines the validator options for the constructor
 */
export type ValidatorOptions = {
  app: Kernel;
  args: Arguments;
  rules: Array<ValidationRules>;
};

/**
 * Enum containing the Validation Rules
 * 
 * @export
 * @enum ValidationRules
 */
export enum ValidationRules {
  REQUIRED_OPTIONS,
  REQUIRED_VALUES,
  NON_DECLEARED_ARGS,
  ON_COMMANDS,
  ACTIONS,
}
