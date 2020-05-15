import { parse } from "../deno_deps.ts";
import { ArgumentsContract } from "./interfaces.ts";
import { CustomArgs } from "./types.ts";

/** It parses the arguments and splits them into commands and options */
export class Arguments implements ArgumentsContract {
  
  /** Aruments from Deno.args (unparsed) */
  protected unparsed_args: Array<string>;

  /** All arguments parsed */
  protected _all: CustomArgs = {};

  /** Option arguments */
  protected _options: CustomArgs = {};

  /** Command arguments */
  protected _commands: Array<string> = [];

  /** Constructor of Arguments object */
  constructor(args: Array<string>) {
    this.unparsed_args = args;
  }

  /** It parses the args */
  public parse(): void {
    this._all = parse(this.unparsed_args);
    this._commands = this.extractCommands(this._all);
    this._options = this.extractOptions(this._all);
  }

  /** Getter of all arguments */
  public get all() {
    return this._all;
  }

  /** Getter of option arguments */
  public get options() {
    return this._options;
  }

  /** Getter of command arguments */
  public get commands(): Array<string> {
    return this._commands;
  }

  /** Splits the arguments and gets the options */
  protected extractOptions(args: CustomArgs): CustomArgs {
    delete args["_"];
    return args;
  }

  /** Splits the arguments and gets the commands */
  protected extractCommands(args: CustomArgs): Array<string> {
    return args["_"] as Array<string>;
  }
}
