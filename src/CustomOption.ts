import { CommandOption } from "./types/types.ts";

/**
 * Class that only handles the custom option form the user
 * (it is not used but it reasign the proper Option object)
 *
 * @export
 * @class CustomOption
 */
export default class CustomOption {
  /** Holds the flags as defined (unparsed) */
  public _flags: string;

  /** The description of the option */
  public _description: string;

  /** If the option is required */
  public _isRequired: boolean;

  /** The custom option processing function */
  public _callback?: Function;

  /** Holds the default value if passed */
  public defaultValue?: any;

  public all_choices?: Array<any>;

  /** Holds the short flag (-p). One letter command */
  protected _letter_option?: string;

  /** Holds the long flag (--port). One letter command */
  protected _word_option = "";

  /** Constructor of Command object */
  constructor(params: CommandOption) {
    this._flags = params.flags;
    this._description = params.description;
    this._isRequired = params.isRequired === true;
    if (params.callback) {
      this._callback = params.callback;
    }
    if (params.defaultValue) {
      this.defaultValue = params.defaultValue;
    }
  }

  /** Set the default value if not setted in constructor */
  public default(defaultValue: any): CustomOption {
    this.defaultValue = defaultValue;
    return this;
  }

  public callback(callback: Function): CustomOption {
    this._callback = callback;
    return this;
  }

  public flags(flags: string): CustomOption {
    this._flags = flags;
    return this;
  }

  public description(description: string): CustomOption {
    this._description = description;
    return this;
  }

  public isRequired(isRequired: boolean): CustomOption {
    this._isRequired = isRequired;
    return this;
  }

  public choices(choices: Array<any>): CustomOption {
    this.all_choices = choices;
    return this;
  }
}
