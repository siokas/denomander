import { green, yellow, bold, parse } from "./deno_deps.ts";
import {
  OnCommand,
  TempOnCommand,
  Parasable,
  PublicAPI
} from "./interfaces.ts";
import AppDetails from "./AppDetails.ts";
import Command from "./Command.ts";
import {
  findCommandFromArgs,
  removeCommandFromArray,
  isCommandInArgs,
  isCommandFromArrayInArgs,
  containCommandInOnCommandArray
} from "./helpers.ts";

/**
 * The main class 
 * 
 * @export default
 * @class Denomander
 * @extends AppDetails
 */
export default class Denomander extends AppDetails
  implements Parasable, PublicAPI {
  /**
    * Holds all the commands
    *
    * @private
    * @type {Array<Command>}
    * @memberof Denomander
   */
  private commands: Array<Command> = [];

  /**
    * Arguments passed by the user during runtime
    *
    * @private
    * @type {any}
    * @memberof Denomander
   */
  private _args: any;

  /**
    * Holds all the available required options
    *
    * @private
    * @type {Array<Command>}
    * @memberof Denomander
   */
  private available_requiredOptions: Array<Command> = [];

  /**
    * Holds all the available commands
    *
    * @private
    * @type {Array<Command>}
    * @memberof Denomander
   */
  private available_commands: Array<Command> = [];

  /**
    * Holds all the available options
    *
    * @private
    * @type {Array<Command>}
    * @memberof Denomander
   */
  private available_options: Array<Command> = [];

  /**
    * Holds the available default options.
    * (help, version)
    *
    * @private
    * @type {Array<Command>}
    * @memberof Denomander
   */
  private available_default_options: Array<Command> = [];

  /**
    * Holds all the available actions
    *
    * @private
    * @type {Array<Command>}
    * @memberof Denomander
   */
  private available_actions: Array<Command> = [];

  /**
    * Holds all the available .on() commands
    *
    * @private
    * @type {Array<OnCommand>}
    * @memberof Denomander
   */
  private available_on_commands: Array<OnCommand> = [];

  /**
    * Temporary array for .on() commands
    *
    * @private
    * @type {Array<TempOnCommand>}
    * @memberof Denomander
   */
  private temp_on_commands: Array<TempOnCommand> = [];

  /**
   * Multiple variables that will be defined during runtime,
   * holding the values of the commands passed from the user
   * 
   * @public
   * @type {any}
   * @memberof Denomander
   */
  [key: string]: any

  /**
   * The Command instance of the --version option
   * 
   * @private
   * @type {Command}
   * @memberof Denomander
   */
  private version_command: Command = new Command({
    value: "-V --version",
    description: "Print the current version",
  });

  /**
   * The Command instance of the --help option
   * 
   * @private
   * @type {Command}
   * @memberof Denomander
   */
  private help_command: Command = new Command({
    value: "-h --help",
    description: "Print command line options (currently set)",
  });

  /**
   * If the user has defined a custom help
   * 
   * @private
   * @type {boolean}
   * @memberof Denomander
   */
  private isHelpConfigured: boolean = false;

  /**
   * If the user has defined a custom version
   * 
   * @private
   * @type {boolean}
   * @memberof Denomander
   */
  private isVersionConfigured: boolean = false;

  /**
   * Generate the default options
   * (help, version)
   * 
   * @private
   * @returns {Denomander}
   * @memberof Denomander
   */
  private generateDefaultOptions(): Denomander {
    return this
      .generateHelpOption()
      .generateVersionOption();
  }

  /**
   * Generate the default help option
   * 
   * @private
   * @returns {Denomander}
   * @memberof Denomander
   */
  private generateHelpOption(): Denomander {
    if (!this.isHelpConfigured) {
      this.commands.push(this.help_command);
      this.available_default_options.push(this.help_command);
    }

    return this;
  }

  /**
   * Generate the default version option
   * 
   * @private
   * @returns {Denomander}
   * @memberof Denomander
   */
  private generateVersionOption(): Denomander {
    if (!this.isVersionConfigured) {
      this.commands.push(this.version_command);
      this.available_default_options.push(this.version_command);
    }

    return this;
  }

  /**
   * Implements the option command
   * 
   * @public
   * @param {string} value
   * @param {string} description 
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  option(value: string, description: string): Denomander {
    this.commands.push(new Command({ value, description }));
    this.available_options.push(new Command({ value, description }));

    return this;
  }

  /**
   * Implements the required option command
   * 
   * @public
   * @param {string} value
   * @param {string} description 
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  requiredOption(value: string, description: string): Denomander {
    let command: Command = new Command(
      { value, description, is_required: true },
    );
    this.commands.push(command);
    this.available_requiredOptions.push(command);

    return this;
  }

  /**
   * Implements the option command
   * 
   * @public
   * @param {string} value
   * @param {string} description optional
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  command(value: string, description?: string): Denomander {
    let new_command: Command = new Command({
      value,
      description,
      type: "command",
    });
    this.commands.push(new_command);
    this.available_commands.push(new_command);

    return this;
  }

  /**
   * Implements the description of the previous mentioned command (by the user)
   * 
   * @public
   * @param {string} description 
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  description(description: string): Denomander {
    let command: Command = this.commands.slice(-1)[0];

    if (command) {
      command.description = description;
    }

    return this;
  }

  /**
   * Implements the action of a command registered by the user
   * 
   * @public
   * @param {Function} callback 
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  action(callback: Function): Denomander {
    let command: Command = this.commands.slice(-1)[0];

    if (command) {
      command.action = callback;
      this.available_actions.push(command);
    }

    return this;
  }

  /**
   * Implements the .on() option
   * 
   * @public
   * @param {string} arg 
   * @param {Function} callback 
   * @memberof PublicAPI
   */
  on(arg: string, callback: Function): Denomander {
    this.temp_on_commands.push({ arg, callback });

    return this;
  }

  /**
   * Lets user to customize the help method
   * 
   * @public
   * @param {string} command 
   * @param {string} description 
   * @memberof PublicAPI
   */
  setHelp(command: string, description: string): Denomander {
    this.help_command = new Command({ value: command, description });

    let new_available_default_options = removeCommandFromArray(
      this.commands,
      "help",
    );

    new_available_default_options.push(this.help_command);
    this.available_default_options = new_available_default_options;
    this.isHelpConfigured = true;

    return this;
  }

  /**
   * Lets user to customize the version method
   *
   * @public
   * @param {string} version  
   * @param {string} command 
   * @param {string} description 
   * @memberof PublicAPI
   */
  setVersion(
    version: string,
    command: string,
    description: string,
  ): Denomander {
    this.version = version;
    this.version_command = new Command({ value: command, description });

    let new_available_default_options = removeCommandFromArray(
      this.commands,
      "version",
    );

    new_available_default_options.push(this.version_command);
    this.available_default_options = new_available_default_options;
    this.isVersionConfigured = true;

    return this;
  }

  /**
   * It prints out the help doc
   * 
   * @private
   * @memberof Denomander
   */
  private print_help(): void {
    console.log();
    console.log(green(bold(this._app_name)));
    console.log();
    console.log(yellow(bold("Description:")));
    console.log(this._app_description);
    console.log();

    if (this.available_requiredOptions.length > 0) {
      console.log(yellow(bold("Required Options:")));
      this.available_requiredOptions.forEach((command) => {
        console.log(command.value + "\t" + command.description);
      });
      console.log();
    }

    console.log(yellow(bold("Options:")));
    this.available_default_options.forEach((command) => {
      console.log(command.value + "\t" + command.description);
    });

    console.log();

    this.available_options.forEach((command) => {
      console.log(command.value + "\t" + command.description);
    });

    console.log();

    if (this.available_commands.length > 0) {
      console.log(yellow(bold("Commands:")));
      this.available_commands.forEach((command) => {
        console.log(command.value + "\t" + command.description);
      });
      console.log();
    }
  }

  /**
   * Validates all types of Commands
   * 
   * @private
   * @returns {Denomander}
   * @memberof Denomander
   */
  private validateArgs(): Denomander {
    if (Object.keys(this._args).length <= 1 && this._args["_"].length < 1) {
      this.print_help();
      Deno.exit(0);
    }

    return this
      .validateOnCommands()
      .validateRequiredOptions()
      .validateOptionsAndCommands();
  }

  /**
   * Validates the .on() commands
   * 
   * @private
   * @returns {Denomander}
   * @memberof Denomander
   */
  private validateOnCommands(): Denomander {
    this.temp_on_commands.forEach((temp: TempOnCommand) => {
      let command: Command = findCommandFromArgs(
        this.commands,
        temp.arg,
      )!;

      if (command) {
        this.available_on_commands.push(
          { command: command, callback: temp.callback },
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

  /**
   * Validates the options and commands
   * and sets the public property of the option passed
   * (ex. --port sets program.port)
   * 
   * @private
   * @returns {Denomander}
   * @throws {Error("You have to pass a parameter")}
   * @throws {Error("Command not found")}
   * @memberof Denomander
   */
  private validateOptionsAndCommands(): Denomander {
    for (let key in this._args) {
      if (key === "length" || !this._args.hasOwnProperty(key)) continue;

      if (key == "_") {
        if (this._args["_"].length > 0) {
          let command: Command = findCommandFromArgs(
            this.commands,
            this._args[key][0],
          )!;
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
              "Command [" + this._args["_"][0] + "] not found",
            );
          }
        }
      } else {
        let command: Command = findCommandFromArgs(
          this.commands,
          key,
        )!;

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

  /**
   * Validates the required options
   * 
   * @private
   * @returns {Denomander}
   * @throws {Error("Required option not specified")}
   * @memberof Denomander
   */
  private validateRequiredOptions(): Denomander {
    this.available_requiredOptions.forEach((command: Command) => {
      if (
        !(this._args[command.word_command!] ||
          this._args[command.letter_command!])
      ) {
        if (
          !isCommandFromArrayInArgs(
            this.available_default_options,
            this._args,
          )
        ) {
          throw new Error(
            "Required option [" +
              (command.word_command! || command.letter_command!) +
              "] not specified",
          );
        }
      }
    });

    return this;
  }

  /**
   * Executes commands
   * 
   * @private
   * @returns {Denomander}
   * @throws {Error("Too much parameters")}
   * @memberof Denomander
   */
  private executeCommands(): Denomander {
    if (
      isCommandInArgs(this.help_command, this._args) &&
      !containCommandInOnCommandArray(
        this.help_command,
        this.available_on_commands,
      )
    ) {
      this.print_help();
    }

    if (
      isCommandInArgs(this.version_command, this._args) &&
      !containCommandInOnCommandArray(
        this.version_command,
        this.available_on_commands,
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

  /**
   * Parses the args.
   * 
   * @param {any} args 
   * @memberof Parasable
   */
  parse(args: any): void {
    this._args = parse(args, { "--": false });

    this
      .generateDefaultOptions()
      .validateArgs()
      .executeCommands();
  }
}
