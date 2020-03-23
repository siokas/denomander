import { OnCommand, TempOnCommand } from "./interfaces.ts";
import { green, yellow, bold } from "https://deno.land/std/fmt/colors.ts";
import AppDetailAccessors from "./AppDetailAccessors.ts";
import Command from "./Command.ts";
import {
  findCommandFromArgs,
  stripDashes,
  removeCommandFromArray,
  isCommandInArgs,
  isCommandFromArrayInArgs,
  arraysHaveMatchingCommand,
  containCommandInOnCommandArray
} from "./helpers.ts";

import { parse } from "https://deno.land/std/flags/mod.ts";

export default class Denomander extends AppDetailAccessors {
  private commands: Array<Command> = [];
  private _args: any;
  private available_requiredOptions: Array<Command> = [];
  private available_commands: Array<Command> = [];
  private available_options: Array<Command> = [];
  private available_default_options: Array<Command> = [];
  private available_actions: Array<Command> = [];
  private available_on_commands: Array<OnCommand> = [];
  private temp_on_commands: Array<TempOnCommand> = [];
  [key: string]: any

  private version_command: Command = new Command({
    value: "-V --version",
    description: "Print the current version"
  });
  private help_command: Command = new Command({
    value: "-h --help",
    description: "Print command line options (currently set)"
  });

  private isHelpConfigured: Boolean = false;
  private isVersionConfigured: Boolean = false;

  private generateDefaultOptions(): Denomander {
    return this
      .generateHelpOption()
      .generateVersionOption();
  }

  private generateHelpOption(): Denomander {
    if (!this.isHelpConfigured) {
      this.commands.push(this.help_command);
      this.available_default_options.push(this.help_command);
    }

    return this;
  }

  private generateVersionOption(): Denomander {
    if (!this.isVersionConfigured) {
      this.commands.push(this.version_command);
      this.available_default_options.push(this.version_command);
    }

    return this;
  }

  option(value: string, description: string): Denomander {
    this.commands.push(new Command({ value, description }));
    this.available_options.push(new Command({ value, description }));

    return this;
  }

  requiredOption(value: string, description: string): Denomander {
    let command: Command | undefined = new Command(
      { value, description, is_required: true }
    );
    this.commands.push(command);
    this.available_requiredOptions.push(command);

    return this;
  }

  command(value: string, description?: string): Denomander {
    let new_command: Command | undefined = new Command({
      value,
      description,
      type: "command"
    });
    this.commands.push(new_command);
    this.available_commands.push(new_command);

    return this;
  }

  description(description: string): Denomander {
    let command: Command | undefined = this.commands.slice(-1)[0];

    if (command) {
      command.description = description;
    }

    return this;
  }

  action(callback: Function): Denomander {
    let command: Command | undefined = this.commands.slice(-1)[0];

    if (command) {
      command.action = callback;
      this.available_actions.push(command);
    }

    return this;
  }

  on(arg: string, callback: Function): Denomander {
    this.temp_on_commands.push({ arg, callback });

    return this;
  }

  setHelp(command: string, description: string): Denomander {
    this.help_command = new Command({ value: command, description });

    let new_available_default_options = removeCommandFromArray(
      this.commands,
      "help"
    );

    new_available_default_options.push(this.help_command);
    this.available_default_options = new_available_default_options;
    this.isHelpConfigured = true;

    return this;
  }

  setVersion(
    version: string,
    command: string,
    description: string
  ): Denomander {
    this.version = version;
    this.version_command = new Command({ value: command, description });

    let new_available_default_options = removeCommandFromArray(
      this.commands,
      "version"
    );

    new_available_default_options.push(this.version_command);
    this.available_default_options = new_available_default_options;
    this.isVersionConfigured = true;

    return this;
  }

  private print_help(): void {
    console.log();
    console.log(green(bold(this._app_name)));
    console.log();
    console.log(yellow(bold("Description:")));
    console.log(this._app_description);
    console.log();

    if (this.available_requiredOptions.length > 0) {
      console.log(yellow(bold("Required Options:")));
      this.available_requiredOptions.forEach(command => {
        console.log(command.value + "\t" + command.description);
      });
      console.log();
    }

    console.log(yellow(bold("Options:")));
    this.available_default_options.forEach(command => {
      console.log(command.value + "\t" + command.description);
    });

    console.log();

    this.available_options.forEach(command => {
      console.log(command.value + "\t" + command.description);
    });

    console.log();

    if (this.available_commands.length > 0) {
      console.log(yellow(bold("Commands:")));
      this.available_commands.forEach(command => {
        console.log(command.value + "\t" + command.description);
      });
      console.log();
    }
  }

  private validateArgs() {
    if (Object.keys(this._args).length <= 1 && this._args["_"].length < 1) {
      this.print_help();
      Deno.exit(0);
    }

    return this
      .validateOnCommands()
      .validateRequiredOptions()
      .validateOptionsAndCommands();
  }

  private validateOnCommands(): Denomander {
    this.temp_on_commands.forEach((temp: TempOnCommand) => {
      let command: Command | undefined = findCommandFromArgs(
        this.commands,
        temp.arg
      );

      if (command) {
        this.available_on_commands.push(
          { command: command, callback: temp.callback }
        );
      } else {
        throw new Error("Command [" + temp.arg + "] not found");
      }
    });

    this.available_on_commands.forEach((arg: OnCommand) => {
      if (isCommandInArgs(arg.command, this._args)) {
        arg.callback();
      }
    });

    return this;
  }

  private validateOptionsAndCommands(): Denomander {
    for (let key in this._args) {
      if (key === "length" || !this._args.hasOwnProperty(key)) continue;

      if (key == "_") {
        if (this._args["_"].length > 0) {
          let command: Command | undefined = findCommandFromArgs(
            this.commands,
            this._args[key][0]
          );
          if (command) {
            if (command.require_command_value) {
              if (this._args["_"].length < 2) {
                throw new Error("You have to pass a parameter");
              }
              command.value = this._args["_"][1];
            }

            if (command.word_command === this._args["_"][0]) {
              this[command.word_command!] = command.value;
            }
          } else {
            throw new Error(
              "Command [" + this._args["_"][0] + "] not found"
            );
          }
        }
      } else {
        let command: Command | undefined = findCommandFromArgs(
          this.commands,
          key
        );

        // variable name conflicts (version)
        if (command && command != this.version_command) {
          let value = this._args[key];
          if (value == "true" || value == "false") {
            value = (value == "true");
          }
          this[command.letter_command!] = value;
          this[command.word_command!] = value;
        } else {
          if (!key.startsWith("allow") && command != this.version_command) {
            throw new Error("Command [" + key + "] not found");
          }
        }
      }
    }

    return this;
  }

  private validateRequiredOptions(): Denomander {
    this.available_requiredOptions.forEach((command: Command) => {
      if (
        !(this._args[command.word_command!] ||
          this._args[command.letter_command!])
      ) {
        if (
          !isCommandFromArrayInArgs(
            this.available_default_options,
            this._args
          )
        ) {
          throw new Error(
            "Required option [" +
              (command.word_command! || command.letter_command!) +
              "] not specified"
          );
        }
      }
    });

    return this;
  }

  private executeCommands(): Denomander {
    if (
      isCommandInArgs(this.help_command, this._args) &&
      !containCommandInOnCommandArray(
        this.help_command,
        this.available_on_commands
      )
    ) {
      this.print_help();
    }

    if (
      isCommandInArgs(this.version_command, this._args) &&
      !containCommandInOnCommandArray(
        this.version_command,
        this.available_on_commands
      )
    ) {
      console.log("v" + this.version);
    }

    this.available_actions.forEach((command: Command) => {
      if (isCommandInArgs(command, this._args)) {
        if (command.action.length == 0) {
          command.action();
        } else if (command.action.length == 1) {
          command.action(this[command.word_command!]);
        } else {
          throw new Error("Too much parameters");
        }
      }
    });

    return this;
  }

  parse(args: any): void {
    this._args = parse(args, { "--": false });

    this
      .generateDefaultOptions()
      .validateArgs()
      .executeCommands();
  }
}
