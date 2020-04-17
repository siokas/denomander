import * as Interface from "./interfaces.ts";
import { Command } from "./Command.ts";
import * as Util from "./utils.ts";

/**
  * Kernel class 
  * 
  * @export
  * @class Kernel
 */
export class Kernel {
  /**
   * Multiple variables that will be defined during runtime,
   * holding the values of the commands passed from the user
   * 
   * @public
   * @type {string | boolean}
   * @memberof Kernel
   */
  [key: string]: any

  /**
   * The name of the app.
   * 
   * @protected
   * @type {string}
   * @memberof Interface.AppDetails
   */
  protected _app_name: string;

  /**
   * The description of the app.
   * 
   * @protected
   * @type {string}
   * @memberof Interface.AppDetails
   */
  protected _app_description: string;

  /**
   * The version of the app.
   * 
   * @protected
   * @type {string}
   * @memberof Interface.AppDetails
   */
  protected _app_version: string;

  /**
    * Holds all the commands
    *
    * @protected
    * @type {Array<Command>}
    * @memberof Kernel
   */
  protected commands: Array<Command> = [];

  /**
    * Arguments passed by the user during runtime
    *
    * @protected
    * @type {Interface.CustomArgs}
    * @memberof Kernel
   */
  protected _args: Interface.CustomArgs = {};

  /**
    * Holds all the available required options
    *
    * @protected
    * @type {Array<Command>}
    * @memberof Kernel
   */
  protected available_requiredOptions: Array<Command> = [];

  /**
    * Holds all the available commands
    *
    * @protected
    * @type {Array<Command>}
    * @memberof Kernel
   */
  protected available_commands: Array<Command> = [];

  /**
    * Holds all the available options
    *
    * @protected
    * @type {Array<Command>}
    * @memberof Kernel
   */
  protected available_options: Array<Command> = [];

  /**
    * Holds the available default options.
    * (help, version)
    *
    * @protected
    * @type {Array<Command>}
    * @memberof Kernel
   */
  protected available_default_options: Array<Command> = [];

  /**
    * Holds all the available actions
    *
    * @protected
    * @type {Array<Command>}
    * @memberof Kernel
   */
  protected available_actions: Array<Command> = [];

  /**
    * Holds all the available .on() commands
    *
    * @protected
    * @type {Array<Interface.OnCommand>}
    * @memberof Kernel
   */
  protected available_on_commands: Array<Interface.OnCommand> = [];

  /**
    * Temporary array for .on() commands
    *
    * @protected
    * @type {Array<Interface.TempOnCommand>}
    * @memberof Kernel
   */
  protected temp_on_commands: Array<Interface.TempOnCommand> = [];

  /**
   * The Command instance of the --version option
   * 
   * @protected
   * @type {Command}
   * @memberof Denomander
   */
  protected version_command: Command = new Command({
    value: "-V --version",
    description: "Print the current version",
  });

  /**
   * The Command instance of the --help option
   * 
   * @protected
   * @type {Command}
   * @memberof Denomander
   */
  protected help_command: Command = new Command({
    value: "-h --help",
    description: "Print command line options (currently set)",
  });

  /**
   * If the user has defined a custom help
   * 
   * @protected
   * @type {boolean}
   * @memberof Denomander
   */
  protected isHelpConfigured = false;

  /**
   * If the user has defined a custom version
   * 
   * @protected
   * @type {boolean}
   * @memberof Denomander
   */
  protected isVersionConfigured = false;

  /**
   * Constructor of Interface.AppDetails object.
   * 
   * @param {Interface.AppDetails} app_details 
   * @memberof Interface.AppDetails
   */
  constructor(app_details?: Interface.AppDetails) {
    if (app_details) {
      this._app_name = app_details.app_name;
      this._app_description = app_details.app_description;
      this._app_version = app_details.app_version;
    } else {
      this._app_name = "My App";
      this._app_description = "My Description";
      this._app_version = "0.0.1";
    }
  }

  /**
   * Getter of the app name
   * 
   * @public
   * @return {string}
   * @memberof Interface.AppDetails
   */
  public get app_name(): string {
    return this._app_name;
  }

  /**
   * Setter of the app name
   * 
   * @public
   * @param {string} name
   * @return void
   * @memberof Interface.AppDetails
   */
  public set app_name(name: string) {
    this._app_name = name;
  }

  /**
   * Getter of the app description
   * 
   * @public
   * @return {string}
   * @memberof Interface.AppDetails
   */
  public get app_description(): string {
    return this._app_description;
  }

  /**
   * Setter of the app description
   * 
   * @public
   * @param {string} description
   * @return void
   * @memberof Interface.AppDetails
   */
  public set app_description(description: string) {
    this._app_description = description;
  }

  /**
   * Getter of the app version
   * 
   * @public
   * @return {string}
   * @memberof Interface.AppDetails
   */
  public get app_version(): string {
    return this._app_version;
  }

  /**
   * Setter of the app version
   * 
   * @public
   * @param {string} version
   * @return void
   * @memberof Interface.AppDetails
   */
  public set app_version(version: string) {
    this._app_version = version;
  }

  /**
   * Generate the default options
   * (help, version)
   * 
   * @protected
   * @returns {Kernel}
   * @memberof Kernel
   */
  protected generateDefaultOptions(): Kernel {
    return this
      .generateHelpOption()
      .generateVersionOption();
  }

  /**
   * Generate the default help option
   * 
   * @protected
   * @returns {Kernel}
   * @memberof Kernel
   */
  protected generateHelpOption(): Kernel {
    if (!this.isHelpConfigured) {
      this.commands.push(this.help_command);
      this.available_default_options.push(this.help_command);
    }

    return this;
  }

  /**
   * Generate the default version option
   * 
   * @protected
   * @returns {Kernel}
   * @memberof Kernel
   */
  protected generateVersionOption(): Kernel {
    if (!this.isVersionConfigured) {
      this.commands.push(this.version_command);
      this.available_default_options.push(this.version_command);
    }

    return this;
  }

  /**
   * Print the help screen
   * 
   * @protected
   * @memberof Kernel
   */
  protected print(): void {
    const app_details: Interface.AppDetails = {
      app_name: this._app_name,
      app_description: this._app_description,
      app_version: this._app_version,
    };

    const command_types: Interface.CommandTypes = {
      default_options: this.available_default_options,
      required_options: this.available_requiredOptions,
      options: this.available_options,
      commands: this.available_commands,
    };

    Util.print_help(app_details, command_types);
  }

  /**
   * Validates all types of Commands
   * 
   * @protected
   * @returns {Kernel}
   * @memberof Kernel
   */
  protected validateArgs(): Kernel {
    if (Object.keys(this._args).length <= 1 && this._args["_"].length < 1) {
      this.print();
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
   * @protected
   * @returns {Kernel}
   * @memberof Kernel
   */
  protected validateOnCommands(): Kernel {
    this.temp_on_commands.forEach((temp: Interface.TempOnCommand) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.commands,
        temp.arg,
      );

      if (command) {
        this.available_on_commands.push(
          { command: command, callback: temp.callback },
        );
      } else {
        throw new Error("Command [" + temp.arg + "] not found");
      }
    });

    this.available_on_commands.forEach((arg: Interface.OnCommand) => {
      if (Util.isCommandInArgs(arg.command, this._args)) {
        arg.callback();
      }
    });

    return this;
  }

  /**
   * Validates the options and commands
   * and sets the public property of the option passed
   * (ex. --port sets Kernel.port)
   * 
   * @protected
   * @returns {Kernel}
   * @throws {Error("You have to pass a parameter")}
   * @throws {Error("Command not found")}
   * @memberof Kernel
   */
  protected validateOptionsAndCommands(): Kernel {
    for (const key in this._args) {
      if (key === "length" || !this._args.hasOwnProperty(key)) continue;

      if (key == "_") {
        if (this._args["_"].length > 0) {
          const command: Command = Util.findCommandFromArgs(
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
        const command: Command = Util.findCommandFromArgs(
          this.commands,
          key,
        )!;

        // variable name conflicts (version)
        if (command && command != this.version_command) {
          let value: string | boolean = this._args[key];
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
   * @protected
   * @returns {Kernel}
   * @throws {Error("Required option not specified")}
   * @memberof Kernel
   */
  protected validateRequiredOptions(): Kernel {
    this.available_requiredOptions.forEach((command: Command) => {
      if (
        !(this._args[command.word_command!] ||
          this._args[command.letter_command!])
      ) {
        if (
          !Util.isCommandFromArrayInArgs(
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
   * @protected
   * @returns {Kernel}
   * @throws {Error("Too much parameters")}
   * @memberof Kernel
   */
  protected executeCommands(): Kernel {
    if (
      Util.isCommandInArgs(this.help_command, this._args) &&
      !Util.containCommandInOnCommandArray(
        this.help_command,
        this.available_on_commands,
      )
    ) {
      this.print();
    }

    if (
      Util.isCommandInArgs(this.version_command, this._args) &&
      !Util.containCommandInOnCommandArray(
        this.version_command,
        this.available_on_commands,
      )
    ) {
      console.log("v" + this._app_version);
    }

    this.available_actions.forEach((command: Command) => {
      if (Util.isCommandInArgs(command, this._args)) {
        if (command.action.length == 0) {
          command.action();
        } else if (command.action.length == 1) {
          if (command.word_command) {
            command.action(this[command.word_command]);
          }
        } else {
          throw new Error("Too much parameters");
        }
      }
    });

    return this;
  }

  /**
   * It starts the program
   * 
   * @protected
   * @returns {Kernel}
   * @memberof Kernel
   */
  protected executeProgram(): Kernel {
    return this.generateDefaultOptions()
      .validateArgs()
      .executeCommands();
  }
}
