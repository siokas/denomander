import Command from "./Command.ts";
import { OnCommand } from "./interfaces.ts";

/**
 * It removes dashes from a string
 * 
 * @param {string} text 
 * @return {string}
 */
export function stripDashes(text: string): string {
  return text.replace(/-/g, "");
}

/**
 * Detects if a strign contains brackets
 * 
 * @param {string} text 
 * @returns {boolean}
 */
export function containsBrackets(text: string): boolean {
  return text.match(/\[(.*?)\]/) ? true : false;
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
      command.word_command === stripDashes(arg) ||
      command.letter_command === stripDashes(arg)
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
 * @param {any} args 
 * @returns {Boolean}
 */
export function isCommandInArgs(command: Command, args: any): Boolean {
  let found = false;

  for (let key in args) {
    if (key === "length" || !args.hasOwnProperty(key)) continue;

    if (
      key != "" &&
      (command.letter_command === key || command.word_command === key)
    ) {
      found = true;
    }
    args["_"].forEach((arg: string) => {
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
 * @param {Array<string>} args 
 * @returns {boolean}
 */
export function isCommandFromArrayInArgs(
  commands: Array<Command>,
  args: Array<string>,
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
  let matching: Array<Command> = array1.filter((element: Command) =>
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

/**
 * It trims of the empty spaces from the given string
 * 
 * @param {string} text 
 * @returns {string}
 */
export function trimString(text: string): string {
  return text.replace(/\s/g, "");
}
