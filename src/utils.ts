import { green, yellow, bold } from "../deno_deps.ts";
import * as Interface from "./interfaces.ts";
import { Command } from "./Command.ts";
import * as Helper from "./helpers.ts";
import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";

/**
   * It prints out the help doc
   * 
   * @export
   * @returns {void}
   */
export function print_help(
  app_details: Interface.AppDetails,
  all_commands: Interface.CommandTypes,
) {
  console.log();
  console.log(green(bold(app_details.app_name)));
  console.log();
  console.log(yellow(bold("Description:")));
  console.log(app_details.app_description);
  console.log();

  if (all_commands.required_options.length > 0) {
    console.log(yellow(bold("Required Options:")));
    all_commands.required_options.forEach((command) => {
      console.log(command.value + "\t" + command.description);
    });
    console.log();
  }

  console.log(yellow(bold("Options:")));
  all_commands.default_options.forEach((command) => {
    console.log(command.value + "\t" + command.description);
  });

  console.log();

  all_commands.options.forEach((command) => {
    console.log(command.value + "\t" + command.description);
  });

  console.log();

  if (all_commands.commands.length > 0) {
    console.log(yellow(bold("Commands:")));
    all_commands.commands.forEach((command) => {
      console.log(command.value + "\t" + command.description);
    });
    console.log();
  }
}

/**
 * It returns the command instance
 * if founded in given arguments
 * 
 * @export
 * @param {Array<Command>} array 
 * @param {string} arg 
 * @returns {Command | undefined}
 */
export function findCommandFromArgs(
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
   * @export
   * @param {Array<Command>} haystack 
   * @param {string} needle 
   * @returns {Array<Command>}
   */
export function removeCommandFromArray(
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
   * @export
   * @param {Command} command 
   * @param {Interface.CustomArgs} args 
   * @returns {Boolean}
   */
export function isCommandInArgs(command: Command, args: Arguments): Boolean {
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
   * @export
   * @param {Command} command 
   * @param {Interface.CustomArgs} args 
   * @returns {Boolean}
   */
export function isOptionInArgs(
  command: Command,
  args: Interface.CustomArgs,
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
   * @export
   * @param {Array<Command>} commands 
   * @param {Interface.CustomArgs} args 
   * @returns {boolean}
   */
export function isCommandFromArrayInArgs(
  commands: Array<Command>,
  args: Interface.CustomArgs,
): Boolean {
  let found = false;

  for (const key in args) {
    if (key === "length" || !args.hasOwnProperty(key)) continue;

    if (key != "_") {
      const command: Command | undefined = findCommandFromArgs(commands, key);

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
   * @export
   * @param {Array<Command>} commands 
   * @param {Arguments} args 
   * @returns {boolean}
   */
export function argIsInAvailableCommands(
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
   * @export
   * @param {Command} command 
   * @param {Array<Command>} array1 
   * @param {Array<Command>} array2 
   * @return {boolean}
   */
export function arraysHaveMatchingCommand(
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
   * in the given array of Interface.OnCommands
   * 
   * @export
   * @param {Command} command 
   * @param {Array<OnCommand>} array 
   * @returns {boolean}
   */
export function containCommandInOnCommandArray(
  command: Command,
  array: Array<Interface.OnCommand>,
): Boolean {
  const matching = array.filter((element) => element.command === command);

  return matching.length === 0 ? false : true;
}

/**
 * It returns the command arguments with required values
 * 
 * @export
 * @param {Arguments} args 
 * @param {Kernel} app 
 * @returns {Array<string>}
 */
export function commandArgsWithRequiredValues(
  args: Arguments,
  app: Kernel,
): Array<string> {
  return args.commands.filter((arg: string) => {
    const command: Command | undefined = findCommandFromArgs(
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
 * @export
 * @param {Interface.CustomArgs} args
 * @param {Array<Command>} defaultOptions 
 * @returns {boolean}
 */
export function optionArgsContainDefaultOptions(
  args: Interface.CustomArgs,
  defaultOptions: Array<Command>,
): boolean {
  const result = defaultOptions.filter((command: Command) => {
    return isOptionInArgs(command, args);
  });

  return result.length > 0;
}
/**
 * It detects if there are no arguments
 * 
 * @param {Arguments} args 
 */
export function emptyArgs(args: Arguments) {
  return Object.keys(args.options).length < 1 && args.commands.length < 1;
}

/**
   * Detects if there are available required options
   * 
   * @protected
   * @returns {boolean}
   */
export function availableRequiredOptions(app: Kernel): boolean {
  return app.available_requiredOptions.length > 0;
}
