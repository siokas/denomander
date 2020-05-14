import { Command } from "./Command.ts";
import { Validator } from "./Validator.ts";
import { Arguments } from "./Arguments.ts";
import { Generator } from "./Generator.ts";
import { Util } from "./Util.ts";
import {
  OnCommand,
  TempOnCommand,
  CustomArgs,
  AppDetails,
  CommandTypes,
  ValidationRules,
} from "./types.ts";
import { Option } from "./Option.ts";

/**
  * It is the core of the app. It is responsible for almost everything.
  * The executeProgram() is the starting point of the app.
  * 
  * @export
  * @class Kernel
 */
export abstract class Kernel {
  /**
   * Multiple variables that will be defined during runtime,
   * holding the values of the commands passed from the user
   * 
   * @public
   * @type string | boolean
   */
  [key: string]: any

  /**
    * Holds all the commands
    *
    * @public
    * @type Array<Command>
   */
  public commands: Array<Command> = [];

  /**
    * Holds all the available required options
    *
    * @public
    * @type {Array<Command>}
   */
  public available_requiredOptions: Array<Command> = [];

  /**
    * Holds all the available commands
    *
    * @public
    * @type {Array<Command>}
   */
  public available_commands: Array<Command> = [];

  /**
    * Holds all the available options
    *
    * @public
    * @type {Array<Command>}
   */
  public available_options: Array<Command> = [];

  /**
    * Holds the available default options.
    * (help, version)
    *
    * @public
    * @type {Array<Command>}
   */
  public available_default_options: Array<Command> = [];

  /**
    * Holds all the available actions
    *
    * @public
    * @type {Array<Command>}
   */
  public available_actions: Array<Command> = [];

  /**
    * Holds all the available .on() commands
    *
    * @public
    * @type {Array<OnCommand>}
   */
  public available_on_commands: Array<OnCommand> = [];

  /**
    * Temporary array for .on() commands
    *
    * @public
    * @type {Array<TempOnCommand>}
   */
  public temp_on_commands: Array<TempOnCommand> = [];

  public BASE_COMMAND: Command = new Command(
    { value: "_", description: "Base Command" },
  );

  /**
   * If the user has defined a custom help
   * 
   * @public
   * @type {boolean}
   */
  public isHelpConfigured = false;

  /**
   * If the user has defined a custom version
   * 
   * @public
   * @type {boolean}
   */
  public isVersionConfigured = false;

  /**
   * The arguments object instance
   * 
   * @public
   * @type {Arguments}
   */
  public args: Arguments | undefined;

  /**
   * The name of the app.
   * 
   * @public
   * @type {string}
   */
  public _app_name: string;

  /**
   * The description of the app.
   * 
   * @public
   * @type {string}
   */
  public _app_description: string;

  /**
   * The version of the app.
   * 
   * @public
   * @type {string}
   */
  public _app_version: string;

  /**
    * Arguments passed by the user during runtime
    *
    * @protected
    * @type {CustomArgs}
   */
  protected _args: CustomArgs = {};

  /**
   * Constructor of AppDetails object.
   * 
   * @param {AppDetails} app_details 
   */
  constructor(app_details?: AppDetails) {
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
   */
  public set app_name(name: string) {
    this._app_name = name;
  }

  /**
   * Getter of the app description
   * 
   * @public
   * @return {string}
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
   */
  public set app_description(description: string) {
    this._app_description = description;
  }

  /**
   * Getter of the app version
   * 
   * @public
   * @return {string}
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
   */
  protected setup(): Kernel {
    return this.versionOption().detectEmptyArgs();
  }

  /**
   * It generates the app variables and running the necessary callback functions
   */
  protected generate(): Kernel {
    if (this.args) {
      const generator = new Generator(this, this.args);
      generator.commandValues()
        .optionValues()
        .onCommands()
        .actionCommands();
    }
    return this;
  }

  /**
   * Validates all types of Commands
   * 
   * @protected
   * @returns {Kernel}
   */
  protected validate(): Kernel {
    if (this.args) {
      const validation = new Validator({
        app: this,
        args: this.args,
        rules: [
          ValidationRules.REQUIRED_VALUES,
          ValidationRules.REQUIRED_OPTIONS,
          ValidationRules.NON_DECLEARED_ARGS,
          ValidationRules.ON_COMMANDS,
        ],
      });

      validation.validate();
    }

    return this;
  }

  /**
   * Executes default commands (--help, --version)
   * 
   * @protected
   * @returns {Kernel}
   * @throws {Error("Too much parameters")}
   */
  protected execute(): Kernel {
    if (this.args) {
      this.args.commands.forEach((argCommand) => {
        const command = Util.findCommandFromArgs(this.commands, argCommand);

        if (command) {
          command.options.forEach((option) => {
            option.value = Util.setOptionValue(option, this.args!);

            if (Util.optionIsInArgs(option, this.args!)) {
              if (option.word_option == "help") {
                console.log("PRINT COMMAND HELP SCREEN");
                Deno.exit(0);
              }

              this[option.word_option] = option.value;
            }
          });
        }
      });
    }

    return this;
  }

  /**
   * Print the help screen
   * 
   * @protected
   */
  protected printDefaultHelp(): void {
    const app_details: AppDetails = {
      app_name: this._app_name,
      app_description: this._app_description,
      app_version: this._app_version,
    };

    Util.print_help(app_details, this.commands, this.BASE_COMMAND);
  }

  /**
   * Setup the default version option
   * 
   * @protected
   * @returns {Kernel}
   */
  protected versionOption(): Kernel {
    if (!this.isVersionConfigured) {
      this.BASE_COMMAND.addOption(
        { flags: "-V --version", description: "Version" },
      );
    }

    return this;
  }
  /**
   * It detects if there are no args and prints the help screen
   * 
   * @protected
   */
  protected detectEmptyArgs(): Kernel {
    if (this.args && Util.emptyArgs(this.args)) {
      this.printDefaultHelp();
      Deno.exit(0);
    }
    return this;
  }

  /**
   * It starts the program
   * 
   * @protected
   * @returns {Kernel}
   */
  protected run(): Kernel {
    return this
      .setup()
      // .validate()
      .execute() // print --help --version in BASE COMMAND
      .generate();
  }
}
