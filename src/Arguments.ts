import { parse } from "../deno_deps.ts";
import * as Interface from "./interfaces.ts";

/**
 * It parses the arguments and splits them into commands and options
 */
export class Arguments implements Interface.ArgumentsContract {

  /**
   * Aruments from Deno.args (unparsed)
   * 
   * @private
   * @type {Array<string>}
   */
  private unparsed_args: Array<string>;

  /**
   * Aruments from Deno.args (unparsed)
   * 
   * @private
   * @type {CustomArgs}
   */
  private _all: Interface.CustomArgs = {};

  /**
   * Aruments from Deno.args (unparsed)
   * 
   * @private
   * @type {CustomArgs}
   */
  private _options: Interface.CustomArgs = {};

  /**
   * Aruments from Deno.args (unparsed)
   * 
   * @private
   * @type {Array<string>}
   */
  private _commands: Array<string> = [];

  constructor(args: Array<string>) {
    this.unparsed_args = args;
  }

  parse(options?:any): void {
    this._all = parse(this.unparsed_args, options);
    this._commands = this.extractCommands(this._all);
    this._options = this.extractOptions(this._all);
  }

  get all() {
    return this._all;
  }

  get options() {
    return this._options;
  }

  get commands() {
    return this._commands;
  }

  private extractOptions(args: Interface.CustomArgs): Interface.CustomArgs {
    delete args["_"];
    return args;
  }

  private extractCommands(args: any): Array<string> {
    return args["_"];
  }
}
