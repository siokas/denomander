import { green, yellow, red, bold } from "../deno_deps.ts";
import { Command } from "./Command.ts";
import { Helper } from "./Helper.ts";
import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { CustomArgs, OnCommand, CommandTypes, AppDetails } from "./types.ts";

/* Specific functionality */
export class Util {
  /**
   * It prints out the help doc
   * 
   * @static
   * @public
   * @returns {void}
   */
  public static print_help(
    app_details: AppDetails,
    all_commands: CommandTypes,
  ) {
    console.log();
    console.log(green(bold(app_details.app_name)));
    console.log(red(bold("v" + app_details.app_version)));
    console.log();
    console.log(yellow(bold("Description:")));
    console.log(app_details.app_description);
    console.log();

    if (all_commands.required_options.length > 0) {
      console.log(yellow(bold("Required Options:")));
      all_commands.required_options.forEach((command) => {
        console.log(command.value + " \t " + command.description);
      });
      console.log();
    }

    console.log(yellow(bold("Options:")));
    all_commands.default_options.forEach((command) => {
      console.log(command.value + " \t " + command.description);
    });

    console.log();

    all_commands.options.forEach((command) => {
      console.log(command.value + " \t " + command.description);
    });

    console.log();

    if (all_commands.commands.length > 0) {
      console.log(yellow(bold("Commands:")));
      all_commands.commands.forEach((command) => {
        console.log(command.value + " \t " + command.description);
      });
      console.log();
    }
  }

  /**
 * It returns the command instance
 * if founded in given arguments
 * 
 * @static
 * @public
 * @param {Array<Command>} array 
 * @param {string} arg 
 * @returns {Command | undefined}
 */
  public static findCommandFromArgs(
    array: Array<Command>,
    arg: string,
  ): Command | undefined {
    return array.find((command: Command) => {
      if (
        command.word_command === Helper.stripDashes(arg) ||
        command.letter_command === Helper.stripDashes(arg)
      ) {
        return command;
      }
    });
  }

  /**
   * It finds the command from given string
   * and removes it from the given array.
   * 
   * @static
   * @public
   * @param {Array<Command>} haystack 
   * @param {string} needle 
   * @returns {Array<Command>}
   */
  public static removeCommandFromArray(
    haystack: Array<Command>,
    needle: string,
  ): Array<Command> {
    haystack.forEach((command: Command, index: number) => {
      if (command.word_command == needle || command.letter_command == needle) {
        haystack.splice(index, 1);
      }
    });

    return haystack;
  }

  /**
   * It detects if the given command is in the arguments
   * 
   * @static
   * @public
   * @param {Command} command 
   * @param {CustomArgs} args 
   * @returns {Boolean}
   */
  public static isCommandInArgs(command: Command, args: Arguments): Boolean {
    let found = false;

    for (const key in args.options) {
      if ((command.letter_command === key || command.word_command === key)) {
        found = true;
      }
    }

    args.commands.forEach((arg: string) => {
      if (command.letter_command === arg || command.word_command === arg) {
        found = true;
      }
    });

    return found;
  }

  /**
   * It detects if the given command is in the arguments
   * 
   * @static
   * @public
   * @param {Command} command 
   * @param {CustomArgs} args 
   * @returns {Boolean}
   */
  public static isOptionInArgs(
    command: Command,
    args: CustomArgs,
  ): Boolean {
    let found = false;

    for (const key in args) {
      if (key === "length" || !args.hasOwnProperty(key)) continue;

      if (
        key != "" &&
        (command.letter_command === key || command.word_command === key)
      ) {
        found = true;
      }
    }

    return found;
  }

  /**
   * It detects if on of the given args,
   * is included in the given array of Commands.
   * 
   * @static
   * @public
   * @param {Array<Command>} commands 
   * @param {CustomArgs} args 
   * @returns {boolean}
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
   * 
   * @static
   * @public
   * @param {Array<Command>} commands 
   * @param {Arguments} args 
   * @returns {boolean}
   */
  public static argIsInAvailableCommands(
    commands: Array<Command>,
    arg: string,
  ): Boolean {
    let found = false;

    commands.forEach((command: Command) => {
      if (command.word_command === arg || command.letter_command === arg) {
        found = true;
      }
    });

    return found;
  }

  /**
   * It detects if the given command is included
   * in BOTH of the other two given arrays of Commands
   * 
   * @static
   * @public
   * @param {Command} command 
   * @param {Array<Command>} array1 
   * @param {Array<Command>} array2 
   * @return {boolean}
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
   * 
   * @static
   * @public
   * @param {Command} command 
   * @param {Array<OnCommand>} array 
   * @returns {boolean}
   */
  public static containCommandInOnCommandArray(
    command: Command,
    array: Array<OnCommand>,
  ): Boolean {
    const matching = array.filter((element) => element.command === command);

    return matching.length === 0 ? false : true;
  }

  /**
 * It returns the command arguments with required values
 * 
 * @static
 * @public
 * @param {Arguments} args 
 * @param {Kernel} app 
 * @returns {Array<string>}
 */
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

  /**
 * It finds if there are default options (--help, --version) in arguments
 * 
 * @static
 * @public
 * @param {CustomArgs} args
 * @param {Array<Command>} defaultOptions 
 * @returns {boolean}
 */
  public static optionArgsContainDefaultOptions(
    args: CustomArgs,
    defaultOptions: Array<Command>,
  ): boolean {
    const result = defaultOptions.filter((command: Command) => {
      return Util.isOptionInArgs(command, args);
    });

    return result.length > 0;
  }
  /**
 * It detects if there are no arguments
 * 
 * @param {Arguments} args 
 */
  public static emptyArgs(args: Arguments) {
    return Object.keys(args.options).length < 1 && args.commands.length < 1;
  }

  /**
   * Detects if there are available required options
   * 
   * @protected
   * @returns {boolean}
   */
  public static availableRequiredOptions(app: Kernel): boolean {
    return app.available_requiredOptions.length > 0;
  }
}
