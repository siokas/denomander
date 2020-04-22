// import * as Interface from "./interfaces.ts";
import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import * as Utils from "./utils.ts";
import { ValidationError } from "./errors.ts";
import * as CustomError from "../custom_errors.ts";
import * as Helper from "./helpers.ts";
import { Generator } from "./Generator.ts";

interface ValidatorContract {
  validate(): void;
}

enum ValidationRules {
  requiredOptions,
  requiredValues,
  nonDeclearedArgs,
}
interface ValidationParameters {
  type: "commands" | "arguments";
  rule: ValidationRules;
}

interface ValidationResult {
  passed: boolean;
  error?: Error;
}
export class Validator implements ValidatorContract {
  public args: Arguments;
  public commands: Kernel;
  public rules: Array<ValidationRules>;

  constructor(
    args: Arguments,
    commands: Kernel,
    rules: Array<ValidationRules>,
  ) {
    this.args = args;
    this.commands = commands;
    this.rules = rules;
  }

  public validate() {
    const failed = this.failed();
    if (failed.length) {
      throw failed[0].error;
    }

    const generate = new Generator(this.commands, this.args);
    generate.commandValues().optionValues();
  }

  private failed() {
    let failed = this.passed().filter((validation) => {
      return !validation.passed;
    });

    return failed;
  }

  private passed(): Array<ValidationResult> {
    return this.rules.map((rule: ValidationRules) => {
      switch (rule) {
        case ValidationRules.nonDeclearedArgs:
          return this.validateNonDeclearedArgs();
        case ValidationRules.requiredOptions:
          return this.validateRequiredOptions();
        case ValidationRules.requiredValues:
          return this.validateRequiredValues();
        default:
          return { passed: false, error: CustomError.VALIDATION_INVALID_RULE };
      }
    });
  }

  private validateNonDeclearedArgs(): ValidationResult {
    const commandArgs: ValidationResult = this.nonDeclearedCommandArgs();
    const optionArgs: ValidationResult = this.nonDeclearedOptionArgs();

    if (commandArgs.error) {
      return { passed: false, error: commandArgs.error };
    }

    if (optionArgs.error) {
      return { passed: false, error: optionArgs.error };
    }

    return { passed: true };
  }

  private validateRequiredOptions() {
    if (this.availableRequiredOptions()) {
      const found = this.commands.available_requiredOptions.filter(
        (command: Command) => {
          return Utils.isOptionInArgs(command, this.args.options) == true;
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

    return { passed: true };
  }

  private validateRequiredValues() {
    if (this.args.commands.length > 0) {
      const commandArgsWithRequiredValues = Utils.commandArgsWithRequiredValues(
        this.args,
        this.commands,
      );

      if (commandArgsWithRequiredValues.length >= this.args.commands.length) {
        return {
          passed: false,
          error: CustomError.VALIDATION_REQUIRED_VALUE_NOT_FOUND,
        };
      }

      const generator = new Generator(this.commands, this.args);
      generator.generateRequiredCommandValues();
    }

    return { passed: true };
  }

  private validateOnCommands() {
  }

  private nonDeclearedCommandArgs(): ValidationResult {
    let result: ValidationResult = { passed: true };

    this.args.commands.forEach((arg: string) => {
      const found = Utils.argIsInAvailableCommands(this.commands.commands, arg);
      if (!found) {
        result = {
          passed: false,
          error: new ValidationError(
            `Argument ${arg} not found in available commands!`,
          ),
        };
      }
    });

    return result;
  }

  private nonDeclearedOptionArgs(): ValidationResult {
    let result: ValidationResult = { passed: true };
    for (const key in this.args.options) {
      const found = Utils.argIsInAvailableCommands(this.commands.commands, key);
      if (!found) {
        result = {
          passed: false,
          error: new ValidationError(
            `Argument ${key} not found in available commands!`,
          ),
        };
      }
    }

    return result;
  }

  private availableRequiredOptions() {
    return this.commands.available_requiredOptions.length > 0;
  }
}
