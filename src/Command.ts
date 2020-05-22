import { Helper } from "./Helper.ts";
import { CommandOption, CommandParams, CommandArgument } from "./types.ts";
import { Option } from "./Option.ts";

/* Command class */
export class Command {
  public declaration = "";
  /** If the command has a required value to be passed from the user*/
  public require_command_value = false;

  /** Holds all the options of the current command */
  public options: Array<Option> = [];

  /** Holds all the required options of the current command */
  public requiredOptions: Array<Option> = [];

  /** Holds all the command arguments of the current command */
  public command_arguments: Array<CommandArgument> = [];

  /** Holds all the aliases of the current command */
  public aliases: Array<string> = [];

  /** Holds the short flag (-p). One letter command */
  private _word_command?: string;

  /** Holds the object's options initiated in constructor */
  private params: CommandParams;

  /** Constructor of Command object */
  constructor(params: CommandParams) {
    this.params = Object.assign({
      description: "",
      action: () => {},
    }, params);

    this.addOption({
      flags: "-h --help",
      description: "Help Screen",
    });

    if (!this.params.value) {
      throw new ReferenceError("You have to specify the command");
    }

    this.declaration = this.params.value;
    this.generateCommand();
  }

  /** Instantiates a new Option object and pushes it to options[] array */
  public addOption(params: CommandOption): Option {
    let option: Option;

    if (params.isRequired) {
      option = new Option(params.flags, params.description, this, true);
      this.options.push(option);
      this.requiredOptions.push(option);
    } else {
      option = new Option(params.flags, params.description, this);
      this.options.push(option);
    }

    return option;
  }

  public addAlias(alias: string): Command {
    this.aliases.push(alias);

    return this;
  }

  public hasOptions(): boolean {
    return this.options.length > 1; // All commands befault has --help as first option
  }

  /** Detects if the current instance has required options */
  public hasRequiredOptions(): boolean {
    return this.requiredOptions.length > 0;
  }

  /** Detects if the command has aliases */
  public hasAlias(): boolean {
    return this.aliases.length > 0;
  }

  public countRequiredCommandArguments(): number {
    return this.command_arguments.filter((commandArg) => commandArg.isRequired)
      .length;
  }

  public hasRequiredArguments(): boolean {
    return this.countRequiredCommandArguments() > 0;
  }

  /**
   * It splits the word command and
   * detects if there is a require command value.
   */
  private generateCommand() {
    const splitedValue = this.params.value.split(" ");

    if (splitedValue.length == 1) {
      this._word_command = Helper.stripDashes(splitedValue[0]);
    } else {
      this._word_command = Helper.stripDashes(splitedValue[0]);
      splitedValue.splice(0, 1);
      splitedValue.forEach((value) => {
        if (Helper.containsBrackets(value)) {
          // Command Here
          if (Helper.containsQuestionMark(value)) {
            this.command_arguments.push(
              {
                argument: Helper.stripBrackets(Helper.stripQuestionMark(value)),
                isRequired: false,
              },
            );
          } else {
            this.command_arguments.push(
              { argument: Helper.stripBrackets(value), isRequired: true },
            );
          }
        }
        if (Helper.containsCurlyBrackets(value)) {
          // Options Here
        }
      });
    }
  }

  /** Gets the usage of the command (used in help screen) */
  get usage(): string {
    let text = "";
    if (this.word_command) {
      text = this.declaration;
    }
    return text;
  }

  /** Getter of the command value*/
  get value(): string {
    return this.params.value;
  }

  /** Setter of the command value*/
  set value(value: string) {
    this.params.value = value;
  }

  /** Getter of the command description */
  get description(): string {
    return this.params.description || "";
  }

  /** Setter of the command description */
  set description(description: string) {
    this.params.description = description;
  }

  /** Getter of the long flag (word command) */
  get word_command(): string | undefined {
    return this._word_command;
  }

  /** Setter of the long flag (word command) */
  set word_command(word_command: string | undefined) {
    this._word_command = word_command;
  }

  /** Getter of the command action (callback function) */
  get action(): Function {
    return this.params.action || Function;
  }

  /** Setter of the command action (callback function) */
  set action(callback: Function) {
    this.params.action = callback;
  }
}
