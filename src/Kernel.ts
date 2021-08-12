import Command from "./Command.ts";
import Validator from "./Validator.ts";
import Arguments from "./Arguments.ts";
import Executor from "./Executor.ts";
import Option from "./Option.ts";
import {
  AliasCommandBuilder,
  AppDetails,
  AppOptions,
  CustomArgs,
  DenomanderErrors,
  KernelAppDetails,
  OnCommand,
  OptionBuilder,
  ValidationRules,
} from "./types/types.ts";
import { isEmptyArgs, isOptionInArgs } from "./utils/detect.ts";
import { printHelp, printHelpClassic } from "./utils/print.ts";
import { setOptionValue } from "./utils/set.ts";

/**
 * It is the core of the app. It is responsible for almost everything.
 * The executeProgram() is the starting point of the app.
 */
abstract class Kernel {
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

  /** Holds all the command aliases */
  public aliases: Array<AliasCommandBuilder> = [];

  /** If the user has defined a custom help */
  public isHelpConfigured = false;

  /** If the user has defined a custom version */
  public isVersionConfigured = false;

  /** The arguments object instance */
  public args?: Arguments;

  /** The name of the app */
  public _app_name?: string;

  /** The description of the app */
  public _app_description?: string;

  /** The version of the app */
  public _app_version?: string;

  /** The version Option instance */
  public versionOption: Option;

  public appOptions: AppOptions = { help: "default" };

  /** The base command is needed to hold the default options like --help, --version */
  public BASE_COMMAND: Command = new Command({
    value: "_",
    description: "Base Command",
  });

  /** Arguments passed by the user during runtime */
  protected _args: CustomArgs = {};

  /** Default errors if no errors passed by user */
  public errors: DenomanderErrors = {
    INVALID_RULE: "Invalid Rule",
    OPTION_NOT_FOUND: "Option not found!",
    COMMAND_NOT_FOUND: "Command not found!",
    REQUIRED_OPTION_NOT_FOUND: "Required option is not specified!",
    REQUIRED_VALUE_NOT_FOUND: "Required command value is not specified!",
    TOO_MANY_PARAMS: "You have passed too many parameters",
    OPTION_CHOICE: "Invalid option choice!",
  };

  /** User have the option to throw the errors. by default it is not enabled */
  public throw_errors = false;

  /** Constructor of AppDetails object */
  constructor(app_details?: KernelAppDetails) {
    if (app_details) {
      this._app_name = app_details.app_name;
      this._app_description = app_details.app_description;
      this._app_version = app_details.app_version;
      if (app_details.errors) {
        this.errors = app_details.errors;
      }
      if (app_details.throw_errors) {
        this.throw_errors = app_details.throw_errors;
      }
      if (app_details.options) {
        this.appOptions = {
          ...this.appOptions,
          ...app_details.options
        };
      }

    }

    this.versionOption = this.BASE_COMMAND.addOption({
      flags: "-V --version",
      description: "Version",
    });
  }

  /** Getter of the app name */
  public get app_name(): string {
    return this._app_name || "My App";
  }

  /** Setter of the app name */
  public set app_name(name: string) {
    this._app_name = name;
  }

  /** Getter of the app description*/
  public get app_description(): string {
    return this._app_description || "My Description";
  }

  /** Setter of the app description */
  public set app_description(description: string) {
    this._app_description = description;
  }

  /** Getter of the app version */
  public get app_version(): string {
    return this._app_version || "0.0.1";
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
    return this.detectEmptyArgs()
      .detectDefaultOptions()
      .detectBaseCommandOptions()
      .setupGlobalOptions();
  }

  /** Executes default commands (--help, --version) */
  protected execute(): Kernel {
    if (this.args) {
      new Executor(this, this.args, this.throw_errors, this.appOptions.help)
        .onCommands()
        .defaultCommands()
        .commandValues()
        .defaultOptionValues()
        .optionValues()
        .actionCommands();
    }
    return this;
  }

  /** Passes the details and commands to prints the help screen */
  protected printDefaultHelp(): void {
    const app_details: AppDetails = {
      app_name: this.app_name,
      app_description: this.app_description,
      app_version: this.app_version,
    };

    switch (this.appOptions.help) {
      case "classic":
        printHelpClassic(app_details, this.commands, this.BASE_COMMAND);
        break;
      case "denomander":
      case "default":
      default:
        printHelp(app_details, this.commands, this.BASE_COMMAND);
        break;
    }
  }

  /** Detects if there are no args and prints the help screen */
  protected detectEmptyArgs(): Kernel {
    if (this.args && isEmptyArgs(this.args)) {
      this.printDefaultHelp();
      Deno.exit(0);
    }

    return this;
  }

  /** Detects the default options and prints the corresponding message */
  protected detectDefaultOptions(): Kernel {
    if (this.args && this.args.commands.length == 0) {
      this.BASE_COMMAND.options.forEach((option) => {
        if (isOptionInArgs(option, this.args!)) {
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
      new Validator({
        app: this,
        args: this.args,
        rules: [ValidationRules.BASE_COMMAND_OPTIONS],
        throw_errors: this.throw_errors,
      }).validate();

      this.BASE_COMMAND.options.forEach((option) => {
        option.value = setOptionValue(option, this.args!);

        this[option.word_option] = option.value;
      });
    }

    return this;
  }

  protected setupGlobalOptions(): Kernel {
    this.globalOptions.forEach((option: OptionBuilder) => {
      this.commands.forEach((command: Command) => {
        command.addOption({
          flags: option.value,
          description: option.description,
        });
      });
    });

    return this;
  }

  /** The starting point of the program */
  protected run(): Kernel {
    return this.setup().execute();
  }
}

export default Kernel;
