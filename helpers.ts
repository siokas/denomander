import Command from "./Command.ts";

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
    if (command.word_command === stripDashes(arg) ||
      command.letter_command === stripDashes(arg))
    {
      return command;
    }
  });
}
