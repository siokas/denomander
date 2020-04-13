import { stripDashes, containsBrackets, trimString } from "./helpers.ts";
import { CommandOptions } from "./interfaces.ts";

/**
  * Command class 
  * 
  * @export
  * @class Command
 */
export class Command {
  /**
   * If the command has a required value
   * to be passed from the user.
   * 
   * @public
   * @type {boolean}
   * @memberof Command
   */
  public require_command_value = false;

  /**
    * Holds the short flag (-p)
    * One letter command.
    *
    * @private
    * @type {string}
    * @memberof Command
   */
  private _letter_command?: string;

  /**
    * Holds the short flag (-p)
    * One letter command.
    *
    * @private
    * @type {string}
    * @memberof Command
   */
  private _word_command?: string;

  /**
   * Holds the object's options
   * initiated in constructor.
   * 
   * @private
   * @type {CommandOptions}
   * @memberof Command
   */
  private options: CommandOptions;

  /**
   * Constructor of Command object.
   * 
   * @param {CommandOptions} options
   * @memberof Command
   */
  constructor(options: CommandOptions) {
    this.options = Object.assign({
      description: "",
      is_required: false,
      type: "option",
      action: () => {},
    }, options);

    if (!this.options.value) {
      throw new ReferenceError("You have to specify the command");
    }

    if (this.options.type == "option") {
      this.generateOption();
    } else {
      this.generateCommand();
    }
  }

  /**
   * It splits the word command and
   * detects if there is a require command value.
   * 
   * @private
   * @returns void
   * @memberof Command
   */
  private generateCommand() {
    const splitedValue = this.options.value.split(" ");

    switch (splitedValue.length) {
      case 1:
        this._word_command = stripDashes(splitedValue[0]);
        break;

      case 2:
        this._word_command = stripDashes(splitedValue[0]);
        if (containsBrackets(splitedValue[1])) {
          this.require_command_value = true;
        }
        break;
    }
  }

  /**
   * It splits the pre declared commands
   * and stores the word_command.
   * 
   * @private
   * @returns void
   * @memberof Command
   */
  private generateOption() {
    const splitedValue: Array<string> = this.splitValue(this.options.value);

    switch (splitedValue.length) {
      case 1:
        if (stripDashes(splitedValue[0]).length === 1) {
          this._letter_command = stripDashes(splitedValue[0]);
        } else {
          this._word_command = stripDashes(splitedValue[0]);
        }
        break;

      case 2:
        if (stripDashes(trimString(splitedValue[0])).length === 1) {
          this._letter_command = stripDashes(trimString(splitedValue[0]));

          if (stripDashes(trimString(splitedValue[1])).length > 1) {
            this._word_command = stripDashes(trimString(splitedValue[1]));
          }
        } else {
          this._word_command = stripDashes(trimString(splitedValue[0]));
        }
        break;

      default:
        break;
    }
  }

  /**
   * It detects if the passed flags
   * are seperated by comma, pipe or space
   * and splits them.
   * 
   * @private
   * @returns {Array<string>}
   * @param {string} value 
   * @memberof Command
   */
  private splitValue(value: string): Array<string> {
    if (value.indexOf(",") !== -1) {
      return value.split(",");
    }

    if (value.indexOf("|") !== -1) {
      return value.split("|");
    }

    return value.split(" ");
  }

  /**
   * Getter of the command value
   * 
   * @public
   * @returns {string}
   * @memberof Command
   */
  get value(): string {
    return this.options.value;
  }

  /**
   * Setter of the command value
   * 
   * @public
   * @param {string} value
   * @returns void
   * @memberof Command
   */
  set value(value: string) {
    this.options.value = value;
  }

  /**
   * Getter of the command description
   * 
   * @public
   * @returns {string}
   * @memberof Command
   */
  get description(): string {
    return this.options.description!;
  }

  /**
   * Setter of the command description
   * 
   * @public
   * @param {string} description
   * @returns void
   * @memberof Command
   */
  set description(description: string) {
    this.options.description = description;
  }

  /**
   * Getter of the the short flag (one letter command)
   * 
   * @public
   * @returns {string | undefined}
   * @memberof Command
   */
  get letter_command(): string | undefined {
    return this._letter_command;
  }

  /**
   * Setter of the short flag (one letter command)
   * 
   * @public
   * @param {string | undefined} letter_command
   * @returns void
   * @memberof Command
   */
  set letter_command(letter_command: string | undefined) {
    this._letter_command = letter_command;
  }

  /**
   * Getter of the long flag (word command)
   * 
   * @public
   * @returns {string | undefined}
   * @memberof Command
   */
  get word_command(): string | undefined {
    return this._word_command;
  }

  /**
   * Setter of the long flag (word command)
   * 
   * @public
   * @param {string | undefined} word_command
   * @returns void
   * @memberof Command
   */
  set word_command(word_command: string | undefined) {
    this._word_command = word_command;
  }

  /**
   * Getter of the command action (callback function)
   * 
   * @public
   * @returns {Function | undefined}
   * @memberof Command
   */
  get action(): Function {
    return this.options.action!;
  }

  /**
   * Setter of the command action (callback function)
   * 
   * @public
   * @param {Function} callback
   * @returns void
   * @memberof Command
   */
  set action(callback: Function) {
    this.options.action = callback;
  }

  /**
   * Getter of the type of the command
   * 
   * @public
   * @returns {"command" | "option"}
   * @memberof Command
   */
  get type(): "command" | "option" {
    return this.options.type!;
  }
}
