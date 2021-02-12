import { Helper } from "./Helper.ts";
import { Util } from "./Util.ts";
import { Command } from "./Command.ts";
import { OptionParameters } from "./types.ts";

/**
  * Option class 
  * 
  * @export
  * @class Option
 */
export class Option {
  /** Holds the flags as defined (unparsed) */
  public flags: string;

  /** The description of the option */
  public description: string;

  /** The command that belongs to it */
  public command: Command;

  /** If the option is required */
  public isRequired: boolean;

  /** The custom option processing function */
  public callback?: Function;

  /** Holds the default value if passed */
  public defaultValue?: any;

  public choises?: Array<any>;

  /** Holds the short flag (-p). One letter command */
  protected _letter_option?: string;

  /** Holds the long flag (--port). One letter command */
  protected _word_option = "";

  /** The value of the option */
  protected _value: any;

  /** Constructor of Command object */
  constructor(params: OptionParameters) {
    this.flags = params.flags;
    this.description = params.description;
    this.command = params.command;
    this.isRequired = params.isRequired === true;
    if (params.callback) {
      this.callback = params.callback;
    }
    if (params.defaultValue) {
      this.defaultValue = params.defaultValue;
      this.value = this.defaultValue;
    }

    if (params.choises) {
      this.choises = params.choises;
    }

    this.splitFlags();
  }

  /** The command that belongs to it */
  public belongsTo(command: Command) {
    this.command = command;
  }

  /** Set new flags and description for this option */
  public reset(flags: string, description: string) {
    this.flags = flags;
    this.description = description;

    this.splitFlags();
  }

  /**
   * It splits the pre declared commands
   * and stores the word_option.
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

  hasDefaultValue(): boolean {
    return this.defaultValue ? true : false;
  }

  /** Getter of the the short flag (one letter command) */
  get letter_option(): string | undefined {
    return this._letter_option;
  }

  /** Setter of the short flag (one letter command) */
  set letter_option(letter_option: string | undefined) {
    this._letter_option = letter_option;
  }

  /** Getter of the long flag (word command) */
  get word_option(): string {
    return this._word_option;
  }

  /** Setter of the long flag (word command) */
  set word_option(word_option: string) {
    this._word_option = word_option;
  }

  /**
   * Getter of the long flag (word command) */
  get value(): any {
    return this._value;
  }

  /** Setter of the long flag (word command) */
  set value(value: any) {
    this._value = value;
  }
}
