import { Command } from "./Command.ts";
import { Kernel } from "./Kernel.ts";
import { Arguments } from "./Arguments.ts";

/** Defines the app detail types */
export type AppDetails = {
  app_name: string;
  app_description: string;
  app_version: string;
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
};

/* Defines the validator options for the constructor */
export type ValidatorOptions = {
  app: Kernel;
  args: Arguments;
  rules: Array<ValidationRules>;
};

/** Defines the Command constactor options */
export type CommandOption = {
  flags: string;
  description: string;
  isRequired?: boolean;
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

/* Enum containing the Validation Rules */
export enum ValidationRules {
  REQUIRED_OPTIONS,
  REQUIRED_VALUES,
  NON_DECLEARED_ARGS,
  ON_COMMANDS,
  ACTIONS,
  BASE_COMMAND_OPTIONS,
}
