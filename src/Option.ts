import { Helper } from "./Helper.ts";
import { Util } from "./Util.ts";
import { Command } from "./Command.ts";

/**
  * Option class 
  * 
  * @export
  * @class Option
 */
export class Option {
  /**
    * Holds the short flag (-p)
    * One letter command.
    *
    * @private
    * @type {string}
   */
  private _letter_option?: string;

  /**
    * Holds the long flag (--port)
    * One letter command.
    *
    * @private
    * @type {string}
   */
  private _word_option: string = "";

  public flags: string;

  public description: string;

  public command: Command;

  public isRequired: boolean;

  public _value: any;

  /**
   * Constructor of Command object.
   * 
   * @param {CommandOptions} options
   */
  constructor(
    flags: string,
    description: string,
    command: Command,
    isRequired = false,
  ) {
    this.flags = flags;
    this.description = description;
    this.command = command;
    this.isRequired = isRequired;

    this.splitFlags();
  }

  belongsTo(command: Command) {
    this.command = command;
  }

  /**
   * It splits the pre declared commands
   * and stores the word_option.
   * 
   * @private
   * @returns void
   */
  private splitFlags() {
    const splitedValue: Array<string> = Util.splitValue(this.flags);

    switch (splitedValue.length) {
      case 1:
        if (Helper.stripDashes(splitedValue[0]).length === 1) {
          this._letter_option = Helper.stripDashes(splitedValue[0]);
        } else {
          this._word_option = Helper.stripDashes(splitedValue[0]);
        }
        break;

      case 2:
        if (
          Helper.stripDashes(Helper.trimString(splitedValue[0])).length === 1
        ) {
          this._letter_option = Helper.stripDashes(
            Helper.trimString(splitedValue[0]),
          );

          if (
            Helper.stripDashes(Helper.trimString(splitedValue[1])).length > 1
          ) {
            this._word_option = Helper.stripDashes(
              Helper.trimString(splitedValue[1]),
            );
          }
        } else {
          this._word_option = Helper.stripDashes(
            Helper.trimString(splitedValue[0]),
          );
        }
        break;

      default:
        break;
    }
  }

  /**
   * Getter of the the short flag (one letter command)
   * 
   * @public
   * @returns {string | undefined}
   */
  get letter_option(): string | undefined {
    return this._letter_option;
  }

  /**
   * Setter of the short flag (one letter command)
   * 
   * @public
   * @param {string | undefined} letter_option
   * @returns void
   */
  set letter_option(letter_option: string | undefined) {
    this._letter_option = letter_option;
  }

  /**
   * Getter of the long flag (word command)
   * 
   * @public
   * @returns {string | undefined}
   */
  get word_option(): string {
    return this._word_option;
  }

  /**
   * Setter of the long flag (word command)
   * 
   * @public
   * @param {string | undefined} word_option
   * @returns void
   */
  set word_option(word_option: string) {
    this._word_option = word_option;
  }

  /**
   * Getter of the long flag (word command)
   * 
   * @public
   * @returns {string | undefined}
   */
  get value(): any {
    return this._value;
  }

  /**
   * Setter of the long flag (word command)
   * 
   * @public
   * @param {string | undefined} word_option
   * @returns void
   */
  set value(value: any) {
    this._value = value;
  }
}
