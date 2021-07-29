import Command from "../Command.ts";
import Arguments from "../Arguments.ts";
import Kernel from "../Kernel.ts";
import Option from "../Option.ts";
import { CustomArgs } from "../types/types.ts";
import { findCommandFromArgs } from "./find.ts";
import { removeDashes } from "./remove.ts";

/** It detects if the given command is in the arguments */
export function isCommandInArgs(command: Command, args: Arguments): Boolean {
  let found = false;

  for (const key in args.options) {
    if (command.word_command === key) {
      found = true;
    }
  }

  args.commands.forEach((arg: string) => {
    if (command.word_command === arg) {
      found = true;
    }

    if (command.hasAlias()) {
      command.aliases.forEach((alias) => {
        if (alias === arg) {
          found = true;
        }
      });
    }
  });

  return found;
}

/** Detects if option is in args */
export function isOptionInArgs(option: Option, args: Arguments) {
  let found = false;

  for (const key in args.options) {
    if (key == option.word_option || key == option.letter_option) {
      found = true;
    }
  }

  return found;
}

/** It detects if the given command is in the arguments */
export function isOptionFromCommandInArgs(
  command: Command,
  args: CustomArgs,
): Boolean {
  let found = false;

  for (const key in args) {
    if (key === "length" || !args.hasOwnProperty(key)) continue;

    if (key != "" && command.word_command === key) {
      found = true;
    }
  }

  return found;
}

/**
 * It detects if on of the given args,
 * is included in the given array of Commands.
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
 * It detects if on of the given args,
 * is included in the given array of Commands.
 */
export function isArgInAvailableCommands(
  commands: Array<Command>,
  arg: string,
): Boolean {
  let found = false;

  commands.forEach((command: Command) => {
    if (command.word_command === arg) {
      found = true;
    }
    if (command.hasAlias()) {
      command.aliases.forEach((alias) => {
        if (alias === removeDashes(arg)) {
          found = true;
        }
      });
    }
  });

  return found;
}

/** Detects if arg is in pre-defined options */
export function isArgInAvailableOptions(
  options: Array<Option>,
  arg: string,
): Boolean {
  let found = false;

  options.forEach((option: Option) => {
    if (option.word_option === arg || option.letter_option === arg) {
      found = true;
    }
  });

  return found;
}

/** It detects if there are default options (--help, --version) in arguments */
export function doesOptionArgsContainDefaultOptions(
  args: Arguments,
  baseCommand: Command,
): boolean {
  let found = false;
  baseCommand.options.forEach((option: Option) => {
    found = isOptionInArgs(option, args);
  });

  return found;
}
/** It detects if there are no arguments */
export function isEmptyArgs(args: Arguments) {
  return Object.keys(args.options).length < 1 && args.commands.length < 1;
}

/** Detects if there are available required options */
export function isAvailableRequiredOptions(app: Kernel): boolean {
  return app.available_requiredOptions.length > 0;
}

/** Detects if a strign contains brackets */
export function itContainsBrackets(text: string): boolean {
  return text.match(/\[(.*?)\]/) ? true : false;
}

/** Detects if a strign contains curly brackets */
export function itContainsCurlyBrackets(text: string): boolean {
  return text.match(/\{(.*?)\}/) ? true : false;
}

/** Detects if a strign contains curly brackets */
export function itContainsQuestionMark(text: string): boolean {
  return text.match(/\?/) ? true : false;
}
