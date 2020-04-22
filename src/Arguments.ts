import { parse } from "../deno_deps.ts";
import * as Interface from "./interfaces.ts";
import { Validator } from "./Validator.ts";

interface ArgumentsContract {
  parse(): void;
}

export class Arguments implements ArgumentsContract {
  private unparsed_args: any;
  private _all: Interface.CustomArgs = {};
  private _options: Interface.CustomArgs = {};
  private _commands: Array<string> = [];

  constructor(args: any) {
    this.unparsed_args = args;
  }

  parse(): void {
    this._all = parse(this.unparsed_args);
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
