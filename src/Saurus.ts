import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";

export class Saurus {
  public allcommands: any = [];
  app: Kernel;
  // _command:Command;

  constructor(app: Kernel) {
    this.app = app;
  }

  command(name: string, callback: Function, description?: string) {
    this.app.command(name);
    this.allcommands.push(name);
    return this;
  }

  describe(text: string) {
    return this;
  }

  option(flags: string, description: string) {
    return this;
  }

  parse() {
    this.app.parse(Deno.args);
  }
}
