import Command from "./Command.ts";
import { OnCommand } from "./interfaces.ts";

export function stripDashes(text: string): string {
  return text.replace(/-/g, "");
}

export function containsBrackets(text: string): boolean {
  return text.match(/\[(.*?)\]/) ? true : false;
}

export function findCommandFromArgs(
  array: Array<Command>,
  arg: string
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

export function removeCommandFromArray(
  haystack: Array<Command>,
  needle: string
): Array<Command> {
  haystack.forEach((command: Command, index: number) => {
    if (command.word_command == needle || command.letter_command == needle) {
      haystack.splice(index, 1);
    }
  });

  return haystack;
}

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
  }

  return found;
}

export function isCommandFromArrayInArgs(
  commands: Array<Command>,
  args: Array<String>
): Boolean {
  let found = false;

  for (let key in args) {
    if (key === "length" || !args.hasOwnProperty(key)) continue;

    if (key != "_") {
      let command: Command | undefined = findCommandFromArgs(commands, key);

      if (command) {
        found = true;
      }
    }
  }

  return found;
}

export function arraysHaveMatchingCommand(
  command: Command,
  array1: Array<Command>,
  array2: Array<Command>
): Boolean {
  let matching: Array<Command> = array1.filter((element: Command) =>
    array2.includes(command)
  );

  return matching.length === 0 ? false : true;
}

export function containCommandInOnCommandArray(
  command: Command,
  array: Array<OnCommand>
): Boolean {
  let matching = array.filter(element => element.command === command);

  return matching.length === 0 ? false : true;
}
