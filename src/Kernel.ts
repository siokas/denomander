import { Command } from "./Command.ts";
import { Validator } from "./Validator.ts";
import { Arguments } from "./Arguments.ts";
import { Executor } from "./Executor.ts";
import { Util } from "./Util.ts";
import {
  AliasCommandBuilder,
  AppDetails,
  CustomArgs,
  DenomanderErrors,
  OnCommand,
  OptionBuilder,
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

  /** Holds all the commands */
  public commands: Array<Command> = [];

  /** Holds all the global options */
  public globalOptions: Array<OptionBuilder> = [];

  /** Holds all the available actions */
  public available_actions: Array<Command> = [];

  /** Holds all the available .on() commands */
  public on_commands: Array<OnCommand> = [];

  public aliases: Array<AliasCommandBuilder> = [];

  /** If the user has defined a custom help */
  public isHelpConfigured = false;

  /** If the user has defined a custom version */
  public isVersionConfigured = false;

  /** The arguments object instance */
  public args: Arguments | undefined;

  /** The name of the app */
  public _app_name: string;

  /** The description of the app */
  public _app_description: string;

  /** The version of the app */
  public _app_version: string;

  public versionOption: Option;

  /** The base command is needed to hold the default options like --help, --version */
  public BASE_COMMAND: Command = new Command(
    { value: "_", description: "Base Command" },
  );

  /** Arguments passed by the user during runtime */
  protected _args: CustomArgs = {};

  public errors: DenomanderErrors = {
    INVALID_RULE: "Invalid Rule",
    OPTION_NOT_FOUND: "Option not found!",
    COMMAND_NOT_FOUND: "Command not found!",
    REQUIRED_OPTION_NOT_FOUND: "Required option is not specified!",
    REQUIRED_VALUE_NOT_FOUND: "Required command value is not specified!",
    TOO_MANY_PARAMS: "You have passed too many parameters",
  };

  /** Constructor of AppDetails object */
  constructor(app_details?: AppDetails) {
    if (app_details) {
      this._app_name = app_details.app_name;
      this._app_description = app_details.app_description;
      this._app_version = app_details.app_version;
      if (app_details.errors) {
        this.errors = app_details.errors;
      }
    } else {
      this._app_name = "My App";
      this._app_description = "My Description";
      this._app_version = "0.0.1";
    }

    this.versionOption = this.BASE_COMMAND.addOption(
      { flags: "-V --version", description: "Version" },
    );
  }

  /** Getter of the app name */
  public get app_name(): string {
    return this._app_name;
  }

  /** Setter of the app name */
  public set app_name(name: string) {
    this._app_name = name;
  }

  /** Getter of the app description*/
  public get app_description(): string {
    return this._app_description;
  }

  /** Setter of the app description */
  public set app_description(description: string) {
    this._app_description = description;
  }

  /** Getter of the app version */
  public get app_version(): string {
    return this._app_version;
  }

  /** Setter of the app version */
  public set app_version(version: string) {
    this._app_version = version;
  }

  public errorMessages(errors: DenomanderErrors) {
    this.errors = errors;
  }

  /** Do some necessary setup */
  protected setup(): Kernel {
    return this
      .detectEmptyArgs()
      .detectDefaultOptions()
      .detectBaseCommandOptions()
      .setupGlobalOptions();
  }

  /** Executes default commands (--help, --version) */
  protected execute(): Kernel {
    if (this.args) {
      new Executor(this, this.args)
        .onCommands()
        .defaultCommands()
        .commandValues()
        .optionValues()
        .actionCommands();
    }
    return this;
  }

  /** Passes the details and commands to prints the help screen */
  protected printDefaultHelp(): void {
    const app_details: AppDetails = {
      app_name: this._app_name,
      app_description: this._app_description,
      app_version: this._app_version,
    };

    Util.print_help(app_details, this.commands, this.BASE_COMMAND);
  }

  /** Detects if there are no args and prints the help screen */
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
            Deno.exit(0);
          }

          if (option === this.versionOption) {
            console.log("v" + this.app_version);
            Deno.exit(0);
          }
        }
      });
    }

    return this;
  }

  protected detectBaseCommandOptions(): Kernel {
    if (this.args && this.args.commands.length == 0) {
      new Validator(
        {
          app: this,
          args: this.args,
          rules: [
            ValidationRules.BASE_COMMAND_OPTIONS,
          ],
        },
      ).validate();

      this.BASE_COMMAND.options.forEach((option) => {
        option.value = Util.setOptionValue(option, this.args!);

        this[option.word_option] = option.value;
      });
    }

    return this;
  }

  protected setupGlobalOptions(): Kernel {
    this.globalOptions.forEach((option: OptionBuilder) => {
      this.commands.forEach((command: Command) => {
        command.addOption(
          { flags: option.value, description: option.description },
        );
      });
    });

    return this;
  }

  /** The starting point of the program */
  protected run(): Kernel {
    return this
      .setup()
      .execute();
  }
}
