import { bold, green, red, resetColor, yellow } from "../../deps.ts";
import Command from "../Command.ts";
import Option from "../Option.ts";
import { AppDetails, CommandArgument } from "../types/types.ts";

/** Prints success message */
export function success_log(text: string, classicMode: boolean = false): void {
  console.log(classicMode ? `${text}` : green(`✅ ${text}`));
}

/** Prints warning message */
export function warning_log(text: string, classicMode: boolean = false): void {
  console.log(classicMode ? `${text}` : yellow(`⚠️ ${text}`));
}

/** Prints error message */
export function error_log(text: string, classicMode: boolean = false): void {
  console.log(classicMode ? `${text}` : red(`❌ ${text}`));
}

function getUniqueOptions(array: Option[]) {
  let options: Option[] = [];
  let distinct: any = [];
  for (let i = 0; i < array.length; i++) {
    if (!distinct.includes(array[i].flags)) {
      distinct.push(array[i].flags);
      options.push(array[i]);
    }
  }

  return options.sort((a, b) => {
    return a.flags.localeCompare(b.flags);
  });
}

function calculateSpaceNeeded(args: string[]) {
  const lengths = args.map((str) => resetColor(str).length);
  const largest = Math.max(...lengths);
  return largest + 2;
}

function printFormatted(key: string, value: string, len: number, pad = false) {
  let padStr = pad ? "  " : "";
  let keyStr = key.padEnd(len);
  console.log(`${padStr}${keyStr}${value}`);
}

/** The help screen. */
export function printHelp(
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

  let commandsList = commands.filter((command) => !command.isDefault);

  const maxLen = calculateSpaceNeeded([
    ...BASE_COMMAND.options.map(({ flags }) => flags),
    ...commandsList.map(({ value }) => value),
  ]);

  console.log(yellow(bold("Options:")));
  BASE_COMMAND.options.forEach((option) => {
    printFormatted(option.flags, option.description, maxLen);
  });

  console.log();

  if (commandsList.length) {
    console.log(yellow(bold("Commands:")));
    commandsList.forEach((command) => {
      printFormatted(command.value, command.description, maxLen);
    });
    console.log();
  }
}

/** The help screen. */
export function printHelpClassic(
  app_details: AppDetails,
  commands: Array<Command>,
  BASE_COMMAND: Command,
) {
  const defaultCommand = commands.find((command) => command.isDefault);

  if (defaultCommand) {
    defaultCommand.options = getUniqueOptions([
      ...BASE_COMMAND.options,
      ...defaultCommand.options,
    ]);
    printCommandHelpClassic(defaultCommand);
    return;
  }

  console.log(`Usage: ${app_details.app_name}`);
  console.log();
  console.log(app_details.app_description);
  console.log();

  let commandsList = commands.filter((command) => !command.isDefault);

  const maxLen = calculateSpaceNeeded([
    ...BASE_COMMAND.options.map(({ flags }) => flags),
    ...commandsList.map(({ value }) => value),
  ]);

  console.log("Options:");
  getUniqueOptions(BASE_COMMAND.options).forEach((option: Option) => {
    printFormatted(option.flags, option.description, maxLen, true);
  });
  console.log();

  if (commandsList.length) {
    console.log("Commands:");
    commandsList.forEach((command) => {
      printFormatted(command.value, command.description, maxLen, true);
    });
    console.log();
  }
}

////////////////////////////////////////////////////////////////////////////////
/** Print the help screen for a specific command. */
export function printCommandHelpOld(command: Command, BASE_COMMAND?: Command) {
  console.log();
  if (command.hasSubCommands()) {
    console.log(yellow(bold("Subcommands:")));
    command.subCommands.map((subCommand: Command) => {
      console.log(subCommand.word_command);
    });
    console.log();
  }
  if (command.isSubCommand()) {
    console.log(yellow(bold("Parent Command:")));
    console.log(command.parentCommand?.word_command);
    console.log();
  }
  if (command.description) {
    console.log(yellow(bold("Description:")));
    console.log(command.description);
    console.log();
  }
  console.log(yellow(bold(command.isDefault ? "Usage:" : "Command Usage:")));
  if (command.hasSubCommands()) {
    console.log(command.usage + " {Subcommand}");
  } else if (command.hasOptions()) {
    console.log(command.usage + " {Options}");
  } else {
    console.log(command.usage);
  }
  console.log();

  const requiredOptions: Option[] = getUniqueOptions([
    ...command.requiredOptions,
    ...(BASE_COMMAND && command.isDefault) ? BASE_COMMAND.requiredOptions : [],
  ]);

  const options: Option[] = getUniqueOptions([
    ...command.options,
    ...(BASE_COMMAND && command.isDefault) ? BASE_COMMAND.options : [],
  ]);

  let maxLen = calculateSpaceNeeded([
    ...command.command_arguments.map(({ value }) => value).filter((val) => val),
    ...requiredOptions.map(({ flags }) => flags),
    ...options.map(({ flags }) => flags),
  ]);

  if (command.command_arguments.length > 0) {
    console.log(yellow(bold("Arguments:")));
    command.command_arguments.forEach((commandArg: CommandArgument) => {
      let helpText = green(
        `${commandArg.argument}${commandArg.isRequired ? "" : "?"}`,
      );

      if (commandArg.description) {
        helpText = helpText + " \t" + commandArg.description;
      }

      printFormatted(command.value, command.description, maxLen);
    });
    console.log();
  }
  if (command.hasRequiredOptions()) {
    console.log(yellow(bold("Required Options:")));
    requiredOptions.forEach((option) => {
      let extraStr = "";

      if (option.hasDefaultValue() || option.choices) {
        extraStr += "\t";
      }

      if (option.hasDefaultValue()) {
        extraStr += `(default: ${option.defaultValue})`;
      }
      if (option.choices) {
        extraStr += `(choices: ${option.choices.toString()})`;
      }

      const valueStr = `${option.description}${extraStr}`;
      printFormatted(green(option.flags), valueStr, maxLen);
    });
    console.log();
  }

  console.log(yellow(bold("Options:")));
  options.forEach((option) => {
    if (!option.isRequired) {
      let extraStr = "";

      if (option.hasDefaultValue() || option.choices) {
        extraStr += "\t";
      }

      if (option.hasDefaultValue()) {
        extraStr += `(default: ${option.defaultValue})`;
      }

      if (option.choices) {
        extraStr += `(choices: ${option.choices.toString()})`;
      }
      const valueStr = `${option.description}${extraStr}`;
      printFormatted(green(option.flags), valueStr, maxLen);
    }
  });
  console.log();
  if (command.hasAlias()) {
    console.log(yellow(bold("Aliases:")));
    command.aliases.forEach((alias) => console.log(alias));
  }
}

/** Print the help screen for a specific command. */
export function printCommandHelp(command: Command, BASE_COMMAND?: Command) {
  let usage = command.usage;

  if (command.isDefault) {
    usage = usage.replace(/^__DEFAULT__ /, "");
  }

  if (command.hasSubCommands()) {
    usage += " {subcommand}";
  } else if (command.hasOptions()) {
    usage += " {options}";
  }

  console.log();
  console.log(yellow(bold(command.isDefault ? "Usage:" : "Command Usage:")));
  console.log(usage);
  console.log();

  if (command.description) {
    console.log(yellow(bold("Description:")));
    console.log(command.description);
    console.log();
  }

  if (command.hasSubCommands()) {
    console.log(yellow(bold("Subcommands:")));
    command.subCommands.map((subCommand: Command) => {
      console.log(subCommand.word_command);
    });
    console.log();
  }
  if (command.isSubCommand()) {
    console.log(yellow(bold("Parent Command:")));
    console.log(command.parentCommand?.word_command);
    console.log();
  }

  const requiredOptions: Option[] = getUniqueOptions([
    ...command.requiredOptions,
    ...(BASE_COMMAND && command.isDefault) ? BASE_COMMAND.requiredOptions : [],
  ]);

  const options: Option[] = getUniqueOptions([
    ...command.options,
    ...(BASE_COMMAND && command.isDefault) ? BASE_COMMAND.options : [],
  ]);

  let maxLen = calculateSpaceNeeded([
    ...command.command_arguments.map(({ value }) => value).filter((val) => val),
    ...requiredOptions.map(({ flags }) => flags),
    ...options.map(({ flags }) => flags),
  ]) + 1; // Not sure why it needs the extra 1.

  if (command.command_arguments.length > 0) {
    const hasRequired = command.command_arguments
      .map(({ isRequired }) => isRequired)
      .includes(true);
    let commandsLen = calculateSpaceNeeded(
      command.command_arguments.map(({ argument }) => argument),
    );
    if (hasRequired) {
      commandsLen += 1;
    }

    maxLen = Math.max(maxLen, commandsLen);

    console.log(yellow(bold("Arguments:")));
    command.command_arguments.forEach((commandArg: CommandArgument) => {
      let helpText = green(
        `${commandArg.argument}${commandArg.isRequired ? "" : "?"}`,
      );

      if (commandArg.description) {
        printFormatted(helpText, commandArg.description, maxLen);
      } else {
        console.log(helpText);
      }
    });
    console.log();
  }
  if (command.hasRequiredOptions()) {
    console.log(yellow(bold("Required Options:")));
    requiredOptions.forEach((option) => {
      let extraStr = "";

      if (option.hasDefaultValue() || option.choices) {
        extraStr += "\t";
      }

      if (option.hasDefaultValue()) {
        extraStr += `(default: ${option.defaultValue})`;
      }

      if (option.choices) {
        extraStr += `(choices: ${option.choices.toString()})`;
      }

      const valueStr = `${option.description}${extraStr}`;
      printFormatted(green(option.flags), valueStr, maxLen);
    });
    console.log();
  }

  console.log(yellow(bold("Options:")));
  options.forEach((option: Option) => {
    if (!option.isRequired) {
      let extraStr = "";

      if (option.hasDefaultValue() || option.choices) {
        extraStr += "\t";
      }

      if (option.hasDefaultValue()) {
        extraStr += `(default: ${option.defaultValue})`;
      }

      if (option.choices) {
        extraStr += `(choices: ${option.choices.toString()})`;
      }
      const valueStr = `${option.description}${extraStr}`;
      printFormatted(green(option.flags), valueStr, maxLen);
    }
  });

  console.log();
  if (command.hasAlias()) {
    console.log(yellow(bold("Aliases:")));
    command.aliases.forEach((alias) => {
      console.log(alias);
    });
  }
}

/** Print the help screen for a specific command (Classic). */
export function printCommandHelpClassic(
  command: Command,
  BASE_COMMAND?: Command,
) {
  let usage = command.usage;

  // ...BASE_COMMAND.options,

  if (command.isDefault) {
    usage = usage.replace(/^__DEFAULT__ /, "");
  }

  if (command.hasSubCommands()) {
    usage += " {subcommand}";
  } else if (command.hasOptions()) {
    usage += " {options}";
  }
  console.log(`Usage: ${usage}`);
  console.log();

  if (command.description) {
    console.log(command.description);
    console.log();
  }

  if (command.hasSubCommands()) {
    console.log("Subcommands:");
    command.subCommands.map((subCommand: Command) => {
      console.log("  " + subCommand.word_command);
    });
    console.log();
  }
  if (command.isSubCommand()) {
    console.log("Parent Command:");
    console.log("  " + command.parentCommand?.word_command);
    console.log();
  }

  const requiredOptions: Option[] = getUniqueOptions([
    ...command.requiredOptions,
    ...(BASE_COMMAND && command.isDefault) ? BASE_COMMAND.requiredOptions : [],
  ]);

  const options: Option[] = getUniqueOptions([
    ...command.options,
    ...(BASE_COMMAND && command.isDefault) ? BASE_COMMAND.options : [],
  ]);

  let maxLen = calculateSpaceNeeded([
    ...requiredOptions.map(({ flags }) => flags),
    ...options.map(({ flags }) => flags),
  ]);

  if (command.command_arguments.length > 0) {
    const hasRequired = command.command_arguments
      .map(({ isRequired }) => isRequired)
      .includes(true);
    let commandsLen = calculateSpaceNeeded(
      command.command_arguments.map(({ argument }) => argument),
    );
    if (hasRequired) {
      commandsLen += 1;
    }

    maxLen = Math.max(maxLen, commandsLen);

    console.log("Arguments:");
    command.command_arguments.forEach((commandArg: CommandArgument) => {
      let helpText = `${commandArg.argument}${
        commandArg.isRequired ? "" : "?"
      }`;

      if (commandArg.description) {
        printFormatted(helpText, commandArg.description, maxLen, true);
      } else {
        console.log(helpText);
      }
    });
    console.log();
  }
  if (command.hasRequiredOptions()) {
    console.log("Required Options:");
    requiredOptions.forEach((option) => {
      let extraStr = "";

      if (option.hasDefaultValue() || option.choices) {
        extraStr += "\t";
      }

      if (option.hasDefaultValue()) {
        extraStr += `(default: ${option.defaultValue})`;
      }

      if (option.choices) {
        extraStr += `(choices: ${option.choices.toString()})`;
      }

      const valueStr = `${option.description}${extraStr}`;
      printFormatted(option.flags, valueStr, maxLen, true);
    });
    console.log();
  }

  console.log("Options:");
  options.forEach((option: Option) => {
    if (!option.isRequired) {
      let extraStr = "";

      if (option.hasDefaultValue() || option.choices) {
        extraStr += "\t";
      }

      if (option.hasDefaultValue()) {
        extraStr += `(default: ${option.defaultValue})`;
      }

      if (option.choices) {
        extraStr += `(choices: ${option.choices.toString()})`;
      }
      const valueStr = `${option.description}${extraStr}`;
      printFormatted(option.flags, valueStr, maxLen, true);
    }
  });

  console.log();
  if (command.hasAlias()) {
    console.log("Aliases:");
    command.aliases.forEach((alias) => {
      console.log("  " + alias);
    });
  }
}
