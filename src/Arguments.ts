import { parse } from "../deno_deps.ts";
import * as Interface from "./interfaces.ts";

/**
 * It parses the arguments and splits them into commands and options
 * 
 * @export
 * @class Arguments
 * @implements ArgumentsContract
 */
export class Arguments implements Interface.ArgumentsContract {
  /**
   * Aruments from Deno.args (unparsed)
   * 
   * @protected
   * @type {Array<string>}
   */
  protected unparsed_args: Array<string>;

  /**
   * All arguments parsed
   * 
   * @protected
   * @type {CustomArgs}
   */
  protected _all: Interface.CustomArgs = {};

  /**
   * Option arguments
   * 
   * @protected
   * @type {CustomArgs}
   */
  protected _options: Interface.CustomArgs = {};

  /**
   * Command arguments
   * 
   * @protected
   * @type {Array<string>}
   */
  protected _commands: Array<string> = [];

  /**
   * Constructor of Arguments object
   * 
   * @param {Array<string>} args
   */
  constructor(args: Array<string>) {
    this.unparsed_args = args;
  }

  /**
   * It parses the args
   * 
   * @public
   */
  public parse(): void {
    this._all = parse(this.unparsed_args);
    this._commands = this.extractCommands(this._all);
    this._options = this.extractOptions(this._all);
  }

  /**
   * Getter of all arguments
   * 
   * @public
   */
  public get all() {
    return this._all;
  }

  /**
   * Getter of option arguments
   * 
   * @public
   * @returns {CustomArgs}
   */
  public get options() {
    return this._options;
  }

  /**
   * Getter of command arguments
   * 
   * @public
   * @returns {Array<string>}
   */
  public get commands(): Array<string> {
    return this._commands;
  }

  /**
   * Splits the arguments and gets the options
   * 
   * @param args {CustomArgs}
   * @returns {CustomArgs}
   */
  protected extractOptions(args: Interface.CustomArgs): Interface.CustomArgs {
    delete args["_"];
    return args;
  }

  /**
   * 
   * @param args {}
   * @returns {Array<string>}
   */
  protected extractCommands(args: Interface.CustomArgs): Array<string> {
    return args["_"] as Array<string>;
  }
}
