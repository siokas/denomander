import Command from "../Command.ts";
/**
 * It finds the command from given string
 * and removes it from the given array.
 */
export function removeCommandFromArray(
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

/** It removes dashes from from the given string */
export function removeQuestionMark(text: string): string {
  return text.replace(/\?/g, "");
}

/** It removes dashes from the given string */
export function removeDashes(text: string): string {
  return text.substr(0, 2).replace(/-/g, "") + text.substr(2, text.length - 1);
}

/** It removes dashes from the given string */
export function removeBrackets(text: string): string {
  return text.replace(/\[/g, "").replace(/\]/g, "");
}

/** It trims of the empty spaces from the given string */
export function trimString(text: string): string {
  return text.replace(/\s/g, "");
}

/** It removes dashes and spaces from the given string */
export function trimDashesAndSpaces(text: string) {
  return removeDashes(trimString(text));
}
