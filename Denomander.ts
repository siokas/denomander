import { green, yellow, bold } from "https://deno.land/std/fmt/colors.ts";
import AppDetailAccessors from "./AppDetailAccessors.ts";
import Command from "./Command.ts";
import { findCommandFromArgs } from "./helpers.ts";

import { parse } from "https://deno.land/std/flags/mod.ts";

export default class Denomander extends AppDetailAccessors {
  private commands: Array<Command> = [];
  private _args: any;
  private available_requiredOptions: Array<Command> = [];
  private available_commands: Array<Command> = [];
  private available_options: Array<Command> = [];
  private available_default_options: Array<Command> = [];
  [key: string]: any;

  private generateDefaultOptions(): Denomander {
    return this
      .generateHelpOption()
      .generateVersionOption();
  }

  private generateHelpOption(): Denomander {
    let command = new Command(
      "-h --help",
      "Print command line options (currently set)"
    );
    this.commands.push(command);
    this.available_default_options.push(command);

    if (this._args.help || this._args.h) {
      this.help();
    }

    return this;
  }

  private generateVersionOption(): Denomander {
    let command = new Command("-V --version", "Print the current version");
    this.commands.push(command);
    this.available_default_options.push(command);

    if (this._args.version || this._args.V) {
      console.log("v" + this.version);
      Deno.exit(0);
    }

    return this;
  }

  option(value: string, description: string): Denomander {
    this.commands.push(new Command(value, description));
    this.available_options.push(new Command(value, description));
    return this;
  }

  requiredOption(value: string, description: string): Denomander {
    let command = new Command(value, description, true);
    this.commands.push(command);
    this.available_requiredOptions.push(command);
    return this;
  }

  command(value: string, description: string): Denomander {
    let new_command = new Command(value, description, false, "command");
    this.commands.push(new_command);
    this.available_commands.push(new_command);
    return this;
  }

  private help(): void {
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
      this.help();
      Deno.exit(0);
    }

    return this
      .validateRequiredOptions()
      .validateOptionsAndCommands();
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
          if (command && command.require_command_value) {
            if (this._args["_"].length < 2) {
              throw new Error("Error! You have to pass a parameter");
            }
            command.value = this._args["_"][1];
            if (command.word_command === this._args["_"][0]) {
              this[command.word_command!] = command.value;
            }
          } else {
            throw new Error(
              "Error! Command [" + this._args["_"][0] + "] not found"
            );
          }
        }
      } else {
        let command: Command | undefined = findCommandFromArgs(
          this.commands,
          key
        );

        // variable name conflicts (version)
        if (command && command.letter_command != "V") {
          let value = this._args[key];
          if (value == "true" || value == "false") {
            value = (value == "true");
          }
          this[command.letter_command!] = value;
          this[command.word_command!] = value;
        } else {
          throw new Error("Error! Command [" + key + "] not found");
        }
      }
    }

    return this;
  }

  private validateRequiredOptions(): Denomander {
    this.available_requiredOptions.forEach((command: Command) => {
      if (!(this._args[command.word_command!] ||
        this._args[command.letter_command!]))
      {
        if (!(this._args.help || this._args.h || this._args.V ||
          this._args.version))
        {
          throw new Error(
            "Error! Required option [" +
              (command.word_command! || command.letter_command!) +
              "] not specified"
          );
        }
      }
    });

    return this;
  }

  parse(args: any): void {
    this._args = parse(args, { "--": false });

    this
      .generateDefaultOptions()
      .validateArgs();
  }
}
