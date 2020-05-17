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
  ValidationRules,
} from "./types.ts";
import { Option } from "./Option.ts";

/**
  * It is the core of the app. It is responsible for almost everything.
  * The executeProgram() is the starting point of the app.
 */
export abstract class Kernel {
  /**
   * Multiple variables that will be defined during runtime,
   * holding the values of the commands passed from the user
   */
  [key: string]: any

  /* Holds all the commands */
  public commands: Array<Command> = [];

  /* Holds all the available actions */
  public available_actions: Array<Command> = [];

  /* Holds all the available .on() commands */
  public available_on_commands: Array<OnCommand> = [];

  /* Temporary array for .on() commands */
  public temp_on_commands: Array<TempOnCommand> = [];

  /* If the user has defined a custom help */
  public isHelpConfigured = false;

  /* If the user has defined a custom version */
  public isVersionConfigured = false;

  /* The arguments object instance */
  public args: Arguments | undefined;

  /* The name of the app */
  public _app_name: string;

  /* The description of the app */
  public _app_description: string;

  /* The version of the app */
  public _app_version: string;

  /** The base command is needed to hold the default options like --help, --version */
  public BASE_COMMAND: Command = new Command(
    { value: "_", description: "Base Command" },
  );

  /* Arguments passed by the user during runtime */
  protected _args: CustomArgs = {};

  /* Constructor of AppDetails object */
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

  /* Getter of the app name */
  public get app_name(): string {
    return this._app_name;
  }

  /* Setter of the app name */
  public set app_name(name: string) {
    this._app_name = name;
  }

  /* Getter of the app description*/
  public get app_description(): string {
    return this._app_description;
  }

  /* Setter of the app description */
  public set app_description(description: string) {
    this._app_description = description;
  }

  /* Getter of the app version */
  public get app_version(): string {
    return this._app_version;
  }

  /* Setter of the app version */
  public set app_version(version: string) {
    this._app_version = version;
  }

  /* Do some necessary setup (ex. set the --version option and detect some things) */
  protected setup(): Kernel {
    return this
      .setVersionOption()
      .detectEmptyArgs()
      .detectDefaultOptions();
  }

  /* Generates the app variables and runs the necessary callback functions */
  protected generate(): Kernel {
    if (this.args) {
      const generator = new Generator(this, this.args);
      generator
        .requiredOptionValues()
        .commandValues()
        .optionValues()
        .onCommands()
        .actionCommands();
    }
    return this;
  }

  /* Validates all types of Commands */
  protected validate(): Kernel {
    if (this.args) {
      const validation = new Validator({
        app: this,
        args: this.args,
        rules: [
          ValidationRules.REQUIRED_VALUES,
          ValidationRules.NON_DECLEARED_ARGS,
          ValidationRules.ON_COMMANDS,
          ValidationRules.REQUIRED_OPTIONS,
        ],
      });

      validation.validate();
    }

    return this;
  }

  /* Executes default commands (--help, --version) */
  protected execute(): Kernel {
    if (this.args) {
      this.args.commands.forEach((argCommand) => {
        const command = Util.findCommandFromArgs(this.commands, argCommand);

        if (command) {
          command.options.forEach((option: Option) => {
            option.value = Util.setOptionValue(option, this.args!);

            if (Util.optionIsInArgs(option, this.args!)) {
              if (option.word_option == "help") {
                Util.printCommandHelp(command!);
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

  /* Passes the details and commands to prints the help screen */
  protected printDefaultHelp(): void {
    const app_details: AppDetails = {
      app_name: this._app_name,
      app_description: this._app_description,
      app_version: this._app_version,
    };

    Util.print_help(app_details, this.commands, this.BASE_COMMAND);
  }

  /* Setup the default version option */
  protected setVersionOption(): Kernel {
    if (!this.isVersionConfigured) {
      this.BASE_COMMAND.addOption(
        { flags: "-V --version", description: "Version" },
      );
    }

    return this;
  }
  /* Detects if there are no args and prints the help screen */
  protected detectEmptyArgs(): Kernel {
    if (this.args && Util.emptyArgs(this.args)) {
      this.printDefaultHelp();
      Deno.exit(0);
    }
    return this;
  }

  /** Detects the default options and prints the corresponding message */
  protected detectDefaultOptions(): Kernel {
    if (this.args && this.args.commands.length == 0) {
      this.BASE_COMMAND.options.forEach((option) => {
        if (Util.optionIsInArgs(option, this.args!)) {
          if (option.word_option == "help") {
            this.printDefaultHelp();
          }

          if (option.word_option == "version") {
            console.log("v" + this.app_version);
          }
        }
      });
    }

    return this;
  }

  /* The starting point of the program */
  protected run(): Kernel {
    return this
      .setup()
      .execute()
      .validate()
      .generate();
  }
}
