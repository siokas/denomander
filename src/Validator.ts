import * as CustomError from "../custom_errors.ts";
import { Util } from "./Util.ts";
import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import { Generator } from "./Generator.ts";
import { ValidatorContract } from "./interfaces.ts";
import {
  ValidatorOptions,
  ValidationResult,
  TempOnCommand,
  ValidationRules,
  OnCommand,
} from "./types.ts";
import { Option } from "./Option.ts";
import { Helper } from "./Helper.ts";

/** It is responsible for validating the arguments and throw the related error */
export class Validator implements ValidatorContract {
  /** Holds the app instance */
  public app: Kernel;

  /** Holds the Arguments instance */
  public args: Arguments;

  /** The array of rules for validation */
  public rules: Array<ValidationRules>;

  /** Constructor of the Validator object */
  constructor(options: ValidatorOptions) {
    this.app = options.app;
    this.args = options.args;
    this.rules = options.rules;
  }

  /** It starts the validation process and throws the first error */
  public validate() {
    const failed = this.failed();
    if (failed.length) {
      throw failed[0].error;
    }
  }

  /** It maps through all validations and returns the ones that didn't pass */
  protected failed(): Array<ValidationResult> {
    const failed = this.runValidations().filter((validation) => {
      return !validation.passed;
    });

    return failed;
  }

  /** It runs all the validations passed as ValidationRules */
  protected runValidations(): Array<ValidationResult> {
    return this.rules.map((rule: ValidationRules) => {
      switch (rule) {
        case ValidationRules.NON_DECLEARED_ARGS:
          return this.validateNonDeclearedArgs();
        case ValidationRules.REQUIRED_OPTIONS:
          return this.validateRequiredOptions();
        case ValidationRules.REQUIRED_VALUES:
          return this.validateRequiredValues();
        case ValidationRules.ON_COMMANDS:
          return this.validateOnCommands();
        case ValidationRules.BASE_COMMAND_OPTIONS:
          return this.validateBaseCommandOptions();
        default:
          return { passed: false, error: CustomError.VALIDATION_INVALID_RULE };
      }
    });
  }

  /** Validates if there are non decleared arguments */
  protected validateNonDeclearedArgs(): ValidationResult {
    const commandArgs: ValidationResult = this
      .nonDeclearedCommandArgs();
    const optionArgs: ValidationResult = this
      .nonDeclearedOptionArgs();

    if (commandArgs.error) {
      return { passed: false, error: commandArgs.error };
    }

    if (optionArgs.error) {
      return { passed: false, error: optionArgs.error };
    }

    return { passed: true };
  }

  /** Validates if the required options are defined */
  protected validateRequiredOptions(): ValidationResult {
    let result: ValidationResult = { passed: true };

    this.args.commands.forEach((argCommand) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        argCommand,
      );

      if (command && command.hasRequiredOptions()) {
        const found = command.requiredOptions.filter((option: Option) => {
          return Util.optionIsInArgs(option, this.args);
        });

        if (!found.length) {
          result = {
            passed: false,
            error: CustomError.VALIDATION_REQUIRED_OPTIONS_NOT_FOUND,
          };
        }
      }
    });

    return result;
  }

  /** Validates all the commands which needs required values to be defined */
  protected validateRequiredValues(): ValidationResult {
    if (this.args.commands.length > 0) {
      const commandArgsWithRequiredValues = Util.commandArgsWithRequiredValues(
        this.args,
        this.app,
      );

      if (commandArgsWithRequiredValues.length >= this.args.commands.length) {
        return {
          passed: false,
          error: CustomError.VALIDATION_REQUIRED_VALUE_NOT_FOUND,
        };
      }
    }

    return { passed: true };
  }

  /** Validates the .on() commands and stacks them in the available commands */
  protected validateOnCommands(): ValidationResult {
    let result: ValidationResult = { passed: true };

    this.app.on_commands.forEach((onCommand: OnCommand) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        onCommand.arg,
      );

      const option: Option | undefined = Util.findOptionFromArgs(
        this.app.BASE_COMMAND.options,
        Helper.noDashesTrimSpaces(onCommand.arg),
      );

      if (!command && !option) {
        result = {
          passed: false,
          error: CustomError.VALIDATION_COMMAND_NOT_FOUND,
        };
      }
    });

    return result;
  }

  /** Validates the .action() parameters and sends them to the callback */
  protected validateActionParams(): ValidationResult {
    let result: ValidationResult = { passed: true };

    this.app.available_actions.forEach((command: Command) => {
      if (Util.isCommandInArgs(command, this.args)) {
        if (command.action.length == 0) {
          command.action();
        } else if (command.action.length == 1) {
          if (command.word_command) {
            command.action(this.app[command.word_command]);
          }
        } else {
          result = {
            passed: false,
            error: CustomError.VALIDATION_TOO_MANY_PARAMS,
          };
        }
      }
    });

    return result;
  }

  /** Validates if there are non decleared commands */
  protected nonDeclearedCommandArgs(): ValidationResult {
    let result: ValidationResult = { passed: true };

    this.args.commands.forEach((arg: string) => {
      const found = Util.argIsInAvailableCommands(this.app.commands, arg);
      if (!found) {
        result = {
          passed: false,
          error: CustomError.VALIDATION_COMMAND_NOT_FOUND,
        };
      }
    });

    return result;
  }

  /** Validates if there are non decleared options */
  protected nonDeclearedOptionArgs(): ValidationResult {
    let result: ValidationResult = { passed: true };

    this.args.commands.forEach((argCommand) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        argCommand,
      );

      if (command) {
        for (const key in this.args.options) {
          const found_in_base_commands = Util.argIsInAvailableOptions(
            this.app.BASE_COMMAND.options,
            key,
          );
          const found_in_all_commands = Util.argIsInAvailableOptions(
            command.options,
            key,
          );

          if (!found_in_base_commands && !found_in_all_commands) {
            result = {
              passed: false,
              error: CustomError.VALIDATION_OPTION_NOT_FOUND,
            };
          }
        }
      }
    });

    return result;
  }

  protected validateBaseCommandOptions(): ValidationResult {
    let result: ValidationResult = { passed: true };

    for (const key in this.args.options) {
      const option: Option | undefined = Util.findOptionFromArgs(
        this.app.BASE_COMMAND.options,
        key,
      );

      if (!option) {
        result = {
          passed: false,
          error: CustomError.VALIDATION_OPTION_NOT_FOUND,
        };
      }
    }
    return result;
  }
}
