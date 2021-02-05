import { Command } from "./Command.ts";
import { Kernel } from "./Kernel.ts";
import { Arguments } from "./Arguments.ts";

/** Defines the app detail types. Applied only in Kernel constuctor */
export type KernelAppDetails = {
  app_name?: string;
  app_description?: string;
  app_version?: string;
  errors?: DenomanderErrors;
  throw_errors?: boolean;
};

/** Defines the app detail types */
export type AppDetails = {
  app_name: string;
  app_description: string;
  app_version: string;
  errors?: DenomanderErrors;
  throw_errors?: boolean;
};

/** Defines the .on() command options */
export type OnCommand = {
  arg: string;
  callback: Function;
};

/** Defines the temporary on command options */
export type TempOnCommand = {
  arg: string;
  callback: Function;
};

/* Defines the Command constructor options */
export type CommandParams = {
  value: string;
  description?: string;
  action?: Function;
};

/** Defines the args */
export type CustomArgs = {
  [key: string]: string | Array<string>;
};

/* Defines all the types of commands */
export type CommandTypes = {
  options: Array<Command>;
  commands: Array<Command>;
};

/* Defines the validation result */
export type ValidationResult = {
  passed: boolean;
  error?: Error;
  command?: string;
};

/* Defines the validator options for the constructor */
export type ValidatorOptions = {
  app: Kernel;
  args: Arguments;
  rules: Array<ValidationRules>;
  throw_errors: boolean;
};

/** Defines the Command constactor options */
export type CommandOption = {
  flags: string;
  description: string;
  isRequired?: boolean;
  callback?: Function;
  defaultValue?: any;
};

export type OptionParameters = {
  flags: string;
  description: string;
  command: Command;
  isRequired?: boolean;
  callback?: Function;
  defaultValue?: any;
};

/** Defines the version setter */
export type VersionType = {
  flags: string;
  description: string;
  version?: string;
};

/** Defines the option builder (used in global options) */
export type OptionBuilder = {
  value: string;
  description: string;
};

export type AliasCommandBuilder = {
  command: string;
  alias: string;
};

export type CommandArgument = {
  argument: string;
  value?: any;
  isRequired: boolean;
};

export type DenomanderErrors = {
  INVALID_RULE: string;
  OPTION_NOT_FOUND: string;
  COMMAND_NOT_FOUND: string;
  REQUIRED_OPTION_NOT_FOUND: string;
  REQUIRED_VALUE_NOT_FOUND: string;
  TOO_MANY_PARAMS: string;
};

/* Enum containing the Validation Rules */
export enum ValidationRules {
  REQUIRED_OPTIONS,
  REQUIRED_VALUES,
  NON_DECLEARED_ARGS,
  ON_COMMANDS,
  ACTIONS,
  BASE_COMMAND_OPTIONS,
}
