import { Util } from "./Util.ts";
import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import { error_log } from "./Logger.ts";
import { ValidatorContract } from "./interfaces.ts";
import {
  OnCommand,
  TempOnCommand,
  ValidationResult,
  ValidationRules,
  ValidatorOptions,
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

  /** User have the option to throw the errors */
  public throw_errors: boolean;

  /** Constructor of the Validator object */
  constructor(options: ValidatorOptions) {
    this.app = options.app;
    this.args = options.args;
    this.rules = options.rules;
    this.throw_errors = options.throw_errors;
  }

  /** It starts the validation process and throws the first error */
  public validate() {
    const failed = this.failed();
    if (failed.length) {
      if (this.throw_errors) {
        throw failed[0].error;
      }
      const error_message = failed[0].error?.message || "";
      const error_command = failed[0].command;
      const error_rest_message = failed[0].rest || "";
      error_log(
        `Error ${error_command}: ${error_message} ${error_rest_message}`,
      );
      Deno.exit(1);
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
        case ValidationRules.OPTION_CHOISES:
          return this.validateOptionChoises();
        default:
          return {
            passed: false,
            error: new Error(this.app.errors.INVALID_RULE),
          };
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
      return {
        passed: false,
        error: commandArgs.error,
        command: commandArgs.command || "",
      };
    }

    if (optionArgs.error) {
      return {
        passed: false,
        error: optionArgs.error,
        command: optionArgs.command || "",
      };
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
        const notFound = command.requiredOptions.filter((option: Option) => {
          return !Util.optionIsInArgs(option, this.args);
        });

        if (notFound.length) {
          result = {
            passed: false,
            error: new Error(this.app.errors.REQUIRED_OPTION_NOT_FOUND),
            command: `(${notFound[0]?.flags})`,
          };
        }
      }
    });

    return result;
  }

  /** Validates all the commands which needs required values to be defined */
  protected validateRequiredValues(): ValidationResult {
    let result: ValidationResult = { passed: true };
    if (this.args.commands.length > 0) {
      this.args.commands.forEach((argCommand) => {
        const command: Command | undefined = Util.findCommandFromArgs(
          this.app.commands,
          argCommand,
        );

        if (command && command.hasRequiredArguments()) {
          const commandRequiredArgs = command.requiredCommandArguments();
          if (
            commandRequiredArgs.length >= this.args.commands.length
          ) {
            const command =
              commandRequiredArgs[commandRequiredArgs.length - 1].argument;
            result = {
              passed: false,
              error: new Error(this.app.errors.REQUIRED_VALUE_NOT_FOUND),
              command: `[${command}]`,
            };
          }
        }
      });
    }

    return result;
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
          error: new Error(this.app.errors.COMMAND_NOT_FOUND),
          command: onCommand.arg,
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
            error: new Error(this.app.errors.TOO_MANY_PARAMS),
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
          error: new Error(this.app.errors.COMMAND_NOT_FOUND),
          command: arg,
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
              error: new Error(this.app.errors.OPTION_NOT_FOUND),
              command: `(${key})`,
            };
          }
        }
      }
    });

    return result;
  }

  protected validateOptionChoises(): ValidationResult {
    let result: ValidationResult = { passed: true };

    this.app.commands.map((command: Command) => {
      command.options.map((option: Option) => {
        if (option.choises) {
          for (const key in this.args.options) {
            if (!option.choises.includes(this.args.options[key])) {
              result = {
                passed: false,
                error: new Error(this.app.errors.OPTION_CHOISE),
                command: `(${key})`,
                rest: `Argument '${
                  this.args.options[key]
                }' is invalid. Allowed choices are: ${option.choises.toString()}`,
              };
            }
          }
        }
      });
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
          error: new Error(this.app.errors.OPTION_NOT_FOUND),
          command: `(${key})`,
        };
      }
    }
    return result;
  }
}
