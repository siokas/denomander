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
} from "./types.ts";

/**
 * It is responsible for validating the arguments and throw the related error
 * 
 * @export
 * @class Validator
 * @implements ValidatorContract
 */
export class Validator implements ValidatorContract {
  /**
   * Holds the app instance
   * 
   * @public
   * @type {Kernel}
   */
  public app: Kernel;

  /**
   * Holds the Arguments instance
   * 
   * @public
   * @type {Arguments}
   */
  public args: Arguments;

  /**
   * The array of rules for validation
   * 
   * @public
   * @type {Array<ValidationRules>}
   */
  public rules: Array<ValidationRules>;

  /**
   * Constructor of the Validator object
   * 
   * @param {ValidatorOptions} options
   */
  constructor(options: ValidatorOptions) {
    this.app = options.app;
    this.args = options.args;
    this.rules = options.rules;
  }

  /**
   * It starts the validation process and throws the first error
   * 
   * @public
   */
  public validate() {
    const failed = this.failed();
    if (failed.length) {
      throw failed[0].error;
    }
  }

  /**
   * It maps through all validations and returns the ones that didn't pass
   * 
   * @protected
   * @returns {Array<ValidationResult>}
   */
  protected failed(): Array<ValidationResult> {
    const failed = this.runValidations().filter((validation) => {
      return !validation.passed;
    });

    return failed;
  }

  /**
   * It runs all the validations passed as ValidationRules
   * 
   * @protected
   * @returns {Array<ValidationResult>}
   */
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
        default:
          return { passed: false, error: CustomError.VALIDATION_INVALID_RULE };
      }
    });
  }

  /**
   * Validates if there are non decleared arguments
   * 
   * @protected 
   * @returns {Array<ValidationResult>}
   */
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

  /**
   * Validates if the required options are defined
   * 
   * @protected 
   * @returns {Array<ValidationResult>}
   */
  protected validateRequiredOptions(): ValidationResult {
    if (
      !Util.optionArgsContainDefaultOptions(
        this.args.all,
        this.app.available_default_options,
      )
    ) {
      if (Util.availableRequiredOptions(this.app)) {
        const found = this.app.available_requiredOptions.filter(
          (command: Command) => {
            return Util.isOptionInArgs(command, this.args.options) == true;
          },
        );

        if (found.length) {
          return { passed: true };
        }

        return {
          passed: false,
          error: CustomError.VALIDATION_REQUIRED_OPTIONS_NOT_FOUND,
        };
      }
    }

    return { passed: true };
  }

  /**
   * Validates all the commands which needs required values to be defined
   * 
   * @protected 
   * @returns {Array<ValidationResult>}
   */
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

      const generator = new Generator(this.app, this.args);
      generator.requiredOptionValues();
    }

    return { passed: true };
  }

  /**
   * Validates the .on() commands and stacks them in the available commands
   * 
   * @protected 
   * @returns {Array<ValidationResult>}
   */
  protected validateOnCommands(): ValidationResult {
    this.app.temp_on_commands.forEach((temp: TempOnCommand) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        temp.arg,
      );

      if (command) {
        this.app.available_on_commands.push(
          { command: command, callback: temp.callback },
        );
      } else {
        return { passed: false, error: CustomError.VALIDATION_ARG_NOT_FOUND };
      }
    });

    return { passed: true };
  }

  /**
   * Validates the .action() parameters and sends them to the callback
   * 
   * @protected 
   * @returns {Array<ValidationResult>}
   */
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

  /**
   * Validates if there are non decleared commands
   * 
   * @protected 
   * @returns {Array<ValidationResult>}
   */
  protected nonDeclearedCommandArgs(): ValidationResult {
    let result: ValidationResult = { passed: true };

    this.args.commands.forEach((arg: string) => {
      const found = Util.argIsInAvailableCommands(this.app.commands, arg);
      if (!found) {
        result = {
          passed: false,
          error: CustomError.VALIDATION_ARG_NOT_FOUND,
        };
      }
    });

    return result;
  }

  /**
   * Validates if there are non decleared options
   * 
   * @protected 
   * @returns {Array<ValidationResult>}
   */
  protected nonDeclearedOptionArgs(): ValidationResult {
    let result: ValidationResult = { passed: true };
    for (const key in this.args.options) {
      const found = Util.argIsInAvailableCommands(this.app.commands, key);
      if (!found) {
        result = {
          passed: false,
          error: CustomError.VALIDATION_ARG_NOT_FOUND,
        };
      }
    }

    return result;
  }
}
