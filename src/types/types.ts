import Command from "../Command.ts";
import Kernel from "../Kernel.ts";
import Arguments from "../Arguments.ts";

/** Help message formats. */
export type HelpMode = "default" | "denomander" | "classic";

/** Defines extra options for the constructor. */
export type AppOptions = {
  /** Help message format. */
  help: HelpMode;
};

/** Defines the app detail types */
export type AppDetails = {
  app_name: string;
  app_description: string;
  app_version: string;
  options?: AppOptions;
  errors?: DenomanderErrors;
  throw_errors?: boolean;
};

/** Defines the app detail types. Applied only in Kernel constuctor */
export type KernelAppDetails = Partial<AppDetails>;

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
  subCommand?: { parent: Command };
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
  rest?: string;
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
  choices?: Array<any>;
};

export type OptionParameters = {
  flags: string;
  description: string;
  command: Command;
  isRequired?: boolean;
  callback?: Function;
  defaultValue?: any;
  choices?: Array<any>;
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
  description?: string;
};

export type CommandError = {
  description: string;
  exit: boolean;
};

export type DenomanderErrors = {
  INVALID_RULE: string;
  OPTION_NOT_FOUND: string;
  COMMAND_NOT_FOUND: string;
  REQUIRED_OPTION_NOT_FOUND: string;
  REQUIRED_VALUE_NOT_FOUND: string;
  TOO_MANY_PARAMS: string;
  OPTION_CHOICE: string;
};

/* Enum containing the Validation Rules */
export enum ValidationRules {
  REQUIRED_OPTIONS,
  REQUIRED_VALUES,
  NON_DECLEARED_ARGS,
  ON_COMMANDS,
  ACTIONS,
  BASE_COMMAND_OPTIONS,
  OPTION_CHOICES,
  COMMAND_HAS_NO_ERRORS,
}
