import Command from "../Command.ts";
import Arguments from "../Arguments.ts";
import Kernel from "../Kernel.ts";
import Option from "../Option.ts";
import { removeDashes } from "./remove.ts";

/** It returns the command instance if founded in given arguments */
export function findCommandFromArgs(
  array: Array<Command>,
  arg: string | number,
): Command | undefined {
  return array.find((command: Command) => {
    if (typeof arg === "string") {
      if (command.word_command === removeDashes(arg)) {
        return command;
      }
      if (command.hasAlias()) {
        const aliasFound = command.aliases.find((alias) => {
          if (alias === removeDashes(arg)) {
            return alias;
          }
        });
        if (aliasFound) {
          return command;
        }
      }
    }
  });
}

/** It returns the command instance if founded in given arguments */
export function findOptionFromArgs(
  array: Array<Option>,
  arg: string,
): Option | undefined {
  return array.find((option: Option) => {
    if (option.word_option === arg || option.letter_option === arg) {
      return option;
    }
  });
}

/** It returns the command arguments with required values */
export function findCommandArgsWithRequiredValues(
  args: Arguments,
  app: Kernel,
): Array<string> {
  return args.commands.filter((arg: string) => {
    const command: Command | undefined = findCommandFromArgs(app.commands, arg);

    if (command) {
      return command.require_command_value;
    }
  });
}

/**
 * It detects if the given command is included
 * in BOTH of the other two given arrays of Commands
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
