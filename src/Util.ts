import { green, yellow, red, bold } from "../deno_deps.ts";
import { Command } from "./Command.ts";
import { Helper } from "./Helper.ts";
import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { CustomArgs, OnCommand, CommandTypes, AppDetails } from "./types.ts";
import { Option } from "./Option.ts";

/** Specific functionality */
export class Util {

  /** It prints out the help doc */
  public static print_help(
    app_details: AppDetails,
    commands: Array<Command>,
    BASE_COMMAND: Command,
  ) {
    console.log();
    console.log(green(bold(app_details.app_name)));
    console.log(red(bold("v" + app_details.app_version)));
    console.log();
    console.log(yellow(bold("Description:")));
    console.log(app_details.app_description);
    console.log();

    console.log(yellow(bold("Options:")));
    BASE_COMMAND.options.forEach((option) => {
      console.log(option.flags + " \t " + option.description);
    });

    console.log();

    console.log(yellow(bold("Commands:")));
    commands.forEach((command) => {
      console.log(command.value + " \t " + command.description);
    });
    console.log();
  }

  /** Print the help screen for a specific command */
  public static printCommandHelp(command: Command) {
    console.log();
    console.log(yellow(bold("Command Usage:")));
    console.log(command.usage + " {options}");
    console.log();
    if (command.hasRequiredOptions()) {
      console.log(yellow(bold("Required Options:")));
      command.requiredOptions.forEach((option) => {
        console.log(option.flags + " \t " + option.description);
      });
      console.log();
    }
    console.log(yellow(bold("Options:")));
    command.options.forEach((option) => {
      if (!option.isRequired) {
        console.log(option.flags + " \t " + option.description);
      }
    });
  }

  /** Detects if option is in args */
  public static optionIsInArgs(option: Option, args: Arguments) {
    let found = false;

    for (const key in args.options) {
      if (key == option.word_option || key == option.letter_option) {
        found = true;
      }
    }

    return found;
  }

  /** Sets the option value */
  public static setOptionValue(option: Option, args: Arguments) {
    for (const key in args.options) {
      if (key == option.word_option || key == option.letter_option) {
        return args.options[key];
      }
    }
  }

  /** It returns the command instance if founded in given arguments */
  public static findCommandFromArgs(
    array: Array<Command>,
    arg: string,
  ): Command | undefined {
    return array.find((command: Command) => {
      if (
        command.word_command === Helper.stripDashes(arg)
      ) {
        return command;
      }
    });
  }

  /**
   * It finds the command from given string
   * and removes it from the given array.
   */
  public static removeCommandFromArray(
    haystack: Array<Command>,
    needle: string,
  ): Array<Command> {
    haystack.forEach((command: Command, index: number) => {
      if (command.word_command == needle) {
        haystack.splice(index, 1);
      }
    });

    return haystack;
  }

  /** It detects if the given command is in the arguments */
  public static isCommandInArgs(command: Command, args: Arguments): Boolean {
    let found = false;

    for (const key in args.options) {
      if ((command.word_command === key)) {
        found = true;
      }
    }

    args.commands.forEach((arg: string) => {
      if (command.word_command === arg) {
        found = true;
      }
    });

    return found;
  }

  /** It detects if the given command is in the arguments */
  public static isOptionInArgs(
    command: Command,
    args: CustomArgs,
  ): Boolean {
    let found = false;

    for (const key in args) {
      if (key === "length" || !args.hasOwnProperty(key)) continue;

      if (
        key != "" &&
        (command.word_command === key)
      ) {
        found = true;
      }
    }

    return found;
  }

  /**
   * It detects if on of the given args,
   * is included in the given array of Commands.
   */
  public static isCommandFromArrayInArgs(
    commands: Array<Command>,
    args: CustomArgs,
  ): Boolean {
    let found = false;

    for (const key in args) {
      if (key === "length" || !args.hasOwnProperty(key)) continue;

      if (key != "_") {
        const command: Command | undefined = Util.findCommandFromArgs(
          commands,
          key,
        );

        if (command) {
          found = true;
        }
      }
    }

    return found;
  }

  /**
   * It detects if on of the given args,
   * is included in the given array of Commands.
   */
  public static argIsInAvailableCommands(
    commands: Array<Command>,
    arg: string,
  ): Boolean {
    let found = false;

    commands.forEach((command: Command) => {
      if (command.word_command === arg) {
        found = true;
      }
    });

    return found;
  }

  /** Detects if arg is in pre-defined options */
  public static argIsInAvailableOptions(
    options: Array<Option>,
    arg: string,
  ): Boolean {
    let found = false;

    options.forEach((option: Option) => {
      if (option.word_option === arg) {
        found = true;
      }
    });

    return found;
  }

  /**
   * It detects if the given command is included
   * in BOTH of the other two given arrays of Commands
   */
  public static arraysHaveMatchingCommand(
    command: Command,
    array1: Array<Command>,
    array2: Array<Command>,
  ): Boolean {
    const matching: Array<Command> = array1.filter((element: Command) =>
      array2.includes(command)
    );

    return matching.length === 0 ? false : true;
  }

  /**
   * Detects if the given command is included
   * in the given array of .OnCommands
   */
  public static containCommandInOnCommandArray(
    command: Command,
    array: Array<OnCommand>,
  ): Boolean {
    const matching = array.filter((element) => element.command === command);

    return matching.length === 0 ? false : true;
  }

  /** It returns the command arguments with required values */
  public static commandArgsWithRequiredValues(
    args: Arguments,
    app: Kernel,
  ): Array<string> {
    return args.commands.filter((arg: string) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        app.commands,
        arg,
      );

      if (command) {
        return command.require_command_value;
      }
    });
  }

  /** It finds if there are default options (--help, --version) in arguments */
  public static optionArgsContainDefaultOptions(
    args: Arguments,
    baseCommand: Command,
  ): boolean {
    let found = false;
    baseCommand.options.forEach((option) => {
      found = Util.optionIsInArgs(option, args);
    });

    return found;
  }
  /** It detects if there are no arguments */
  public static emptyArgs(args: Arguments) {
    return Object.keys(args.options).length < 1 && args.commands.length < 1;
  }

  /** Detects if there are available required options */
  public static availableRequiredOptions(app: Kernel): boolean {
    return app.available_requiredOptions.length > 0;
  }

  /**
   * It detects if the passed flags
   * are seperated by comma, pipe or space
   * and splits them.
   */
  public static splitValue(value: string): Array<string> {
    if (value.indexOf(",") !== -1) {
      return value.split(",");
    }

    if (value.indexOf("|") !== -1) {
      return value.split("|");
    }

    return value.split(" ");
  }
}
