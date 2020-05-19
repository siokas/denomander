
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";

export class Lizard {
  public allcommands: any = [];
  app: Kernel;

  constructor(app: Kernel) {
    this.app = app;
  }

  command(name: string, callback: Function) {
    this.app.command(name).action(callback);
    this.allcommands.push(name);
    return this;
  }

  describe(text: string) {
    const command: Command = this.app.commands.slice(-1)[0];
    if(command){
        command.description = text;
    }
    return this;
  }

  option(flags: string, description: string) {
    const command: Command = this.app.commands.slice(-1)[0];

    if(command){
        command.addOption({flags, description});
    }
    return this;
  }

  requiredOption(flags: string, description: string) {
    const command: Command = this.app.commands.slice(-1)[0];

    if(command){
        command.addOption({flags, description, isRequired: true});
    }
    return this;
  }

  parse() {
    this.app.parse(Deno.args);
  }
}