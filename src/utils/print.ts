import { bold, green, red, yellow } from "../../deps.ts";
import Command from "../Command.ts";
import { AppDetails, CommandArgument } from "../types/types.ts";

/** Prints success message */
export function success_log(text: string): void {
  console.log(green(`✅ ${text}`));
}

/** Prints warning message */
export function warning_log(text: string): void {
  console.log(yellow(`⚠️ ${text}`));
}

/** Prints error message */
export function error_log(text: string): void {
  console.log(red(`❌ ${text}`));
}

/** The help screen */
export function print_help(
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
export function printCommandHelp(command: Command) {
  console.log();
  if (command.description) {
    console.log(yellow(bold("Description:")));
    console.log(command.description);
    console.log();
  }
  console.log(yellow(bold("Command Usage:")));
  if (command.hasOptions()) {
    console.log(command.usage + " {Options}");
  } else {
    console.log(command.usage);
  }
  console.log();

  if (command.command_arguments.length > 0) {
    console.log(yellow(bold("Arguments:")));
    command.command_arguments.forEach((commandArg: CommandArgument) => {
      let helpText = green(
        `${commandArg.argument}${commandArg.isRequired ? "" : "?"}`,
      );

      if (commandArg.description) {
        helpText = helpText + " \t" + commandArg.description;
      }

      console.log(helpText);
    });
    console.log();
  }
  if (command.hasRequiredOptions()) {
    console.log(yellow(bold("Required Options:")));
    command.requiredOptions.forEach((option) => {
      let helpText = green(option.flags) + " \t " + option.description + " \t ";

      if (option.hasDefaultValue()) {
        helpText = helpText + `(default: ${option.defaultValue})`;
      }

      if (option.choices) {
        helpText = helpText + `(choices: ${option.choices.toString()})`;
      }
      console.log(helpText);
    });
    console.log();
  }
  console.log(yellow(bold("Options:")));
  command.options.forEach((option) => {
    if (!option.isRequired) {
      let helpText = green(option.flags) + " \t " + option.description + " \t ";

      if (option.hasDefaultValue()) {
        helpText = helpText + `(default: ${option.defaultValue})`;
      }

      if (option.choices) {
        helpText = helpText + `(choices: ${option.choices.toString()})`;
      }
      console.log(helpText);
    }
  });
  console.log();
  if (command.hasAlias()) {
    console.log(yellow(bold("Aliases:")));
    command.aliases.forEach((alias) => console.log(alias));
  }
}
