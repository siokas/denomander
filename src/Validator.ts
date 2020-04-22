import * as Interface from "./interfaces.ts";
import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import * as Utils from "./utils.ts";
import * as CustomError from "../custom_errors.ts";
import { Generator } from "./Generator.ts";

export class Validator implements Interface.ValidatorContract {
  public args: Arguments;
  public app: Kernel;
  public rules: Array<Utils.ValidationRules>;

  constructor(
    args: Arguments,
    app: Kernel,
    rules: Array<Utils.ValidationRules>,
  ) {
    this.args = args;
    this.app = app;
    this.rules = rules;
  }

  public validate() {
    const failed = this.failed();
    if (failed.length) {
      throw failed[0].error;
    }

    const generate = new Generator(this.app, this.args);
    generate
      .commandValues()
      .optionValues()
      .onCommands();
  }

  private failed() {
    let failed = this.passed().filter((validation) => {
      return !validation.passed;
    });

    return failed;
  }

  private passed(): Array<Interface.ValidationResult> {
    return this.rules.map((rule: Utils.ValidationRules) => {
      switch (rule) {
        case Utils.ValidationRules.NON_DECLEARED_ARGS:
          return this.validateNonDeclearedArgs();
        case Utils.ValidationRules.REQUIRED_OPTIONS:
          return this.validateRequiredOptions();
        case Utils.ValidationRules.REQUIRED_VALUES:
          return this.validateRequiredValues();
        case Utils.ValidationRules.ON_COMMANDS:
          return this.validateOnCommands();
        default:
          return { passed: false, error: CustomError.VALIDATION_INVALID_RULE };
      }
    });
  }

  private validateNonDeclearedArgs(): Interface.ValidationResult {
    const commandArgs: Interface.ValidationResult = this
      .nonDeclearedCommandArgs();
    const optionArgs: Interface.ValidationResult = this
      .nonDeclearedOptionArgs();

    if (commandArgs.error) {
      return { passed: false, error: commandArgs.error };
    }

    if (optionArgs.error) {
      return { passed: false, error: optionArgs.error };
    }

    return { passed: true };
  }

  private validateRequiredOptions(): Interface.ValidationResult {
    if (this.availableRequiredOptions()) {
      const found = this.app.available_requiredOptions.filter(
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

  private validateRequiredValues(): Interface.ValidationResult {
    if (this.args.commands.length > 0) {
      const commandArgsWithRequiredValues = Utils.commandArgsWithRequiredValues(
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
      generator.generateRequiredCommandValues();
    }

    return { passed: true };
  }

  private validateOnCommands(): Interface.ValidationResult {
    this.app.temp_on_commands.forEach((temp: Interface.TempOnCommand) => {
      const command: Command | undefined = Utils.findCommandFromArgs(
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

  private nonDeclearedCommandArgs(): Interface.ValidationResult {
    let result: Interface.ValidationResult = { passed: true };

    this.args.commands.forEach((arg: string) => {
      const found = Utils.argIsInAvailableCommands(this.app.commands, arg);
      if (!found) {
        result = {
          passed: false,
          error: CustomError.VALIDATION_ARG_NOT_FOUND,
        };
      }
    });

    return result;
  }

  private nonDeclearedOptionArgs(): Interface.ValidationResult {
    let result: Interface.ValidationResult = { passed: true };
    for (const key in this.args.options) {
      const found = Utils.argIsInAvailableCommands(this.app.commands, key);
      if (!found) {
        result = {
          passed: false,
          error: CustomError.VALIDATION_ARG_NOT_FOUND,
        };
      }
    }

    return result;
  }

  private availableRequiredOptions() {
    return this.app.available_requiredOptions.length > 0;
  }
}
