import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import { AppDetails } from "./types.ts";

export class Lizard {
  public allcommands: any = [];
  app: Kernel;

  constructor(app: Kernel) {
    this.app = app;
  }

  appDetails(app_details: AppDetails) {
    this.app.app_name = app_details.app_name;
    this.app.app_description = app_details.app_description;
    this.app.app_version = app_details.app_version;

    return this;
  }

  appName(name: string) {
    this.app.app_name = name;

    return this;
  }

  appDescription(description: string) {
    this.app.app_description = description;

    return this;
  }

  appVersion(version: string) {
    this.app.app_version = version;

    return this;
  }

  command(name: string, callback: Function) {
    this.app.command(name).action(callback);
    this.allcommands.push(name);
    return this;
  }

  describe(text: string) {
    const command: Command = this.app.commands.slice(-1)[0];
    if (command) {
      command.description = text;
    }
    return this;
  }

  option(flags: string, description: string) {
    const command: Command = this.app.commands.slice(-1)[0];

    if (command) {
      command.addOption({ flags, description });
    }
    return this;
  }

  requiredOption(flags: string, description: string) {
    const command: Command = this.app.commands.slice(-1)[0];

    if (command) {
      command.addOption({ flags, description, isRequired: true });
    }
    return this;
  }

  parse() {
    this.app.parse(Deno.args);
  }
}
