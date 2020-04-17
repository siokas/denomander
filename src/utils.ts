import { green, yellow, bold } from "../deno_deps.ts";
import {
  CommandTypes,
  AppDetails,
  OnCommand,
  CustomArgs
} from "./interfaces.ts";
import { Command } from "./Command.ts";
import * as Helper from "./helpers.ts";

/**
   * It prints out the help doc
   * 
   * @returns {void}
   */
export function print_help(
  app_details: AppDetails,
  all_commands: CommandTypes,
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
   * @param {Command} command 
   * @param {CustomArgs} args 
   * @returns {Boolean}
   */
export function isCommandInArgs(command: Command, args: CustomArgs): Boolean {
  let found = false;

  for (const key in args) {
    if (key === "length" || !args.hasOwnProperty(key)) continue;

    if (
      key != "" &&
      (command.letter_command === key || command.word_command === key)
    ) {
      found = true;
    }

    const commandArgs: Array<string> = eval(args["_"]);

    commandArgs.forEach((arg: string) => {
      if (command.letter_command === arg || command.word_command === arg) {
        found = true;
      }
    });
  }

  return found;
}

/**
   * It detects if on of the given args,
   * is included in the given array of Commands.
   * 
   * @param {Array<Command>} commands 
   * @param {CustomArgs} args 
   * @returns {boolean}
   */
export function isCommandFromArrayInArgs(
  commands: Array<Command>,
  args: CustomArgs,
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
   * It detects if the given command is included
   * in BOTH of the other two given arrays of Commands
   * 
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
   * in the given array of OnCommands
   * 
   * @param {Command} command 
   * @param {Array<OnCommand>} array 
   * @returns {boolean}
   */
export function containCommandInOnCommandArray(
  command: Command,
  array: Array<OnCommand>,
): Boolean {
  const matching = array.filter((element) => element.command === command);

  return matching.length === 0 ? false : true;
}
