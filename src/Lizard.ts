import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import { AppDetails } from "./types.ts";

/** Lizard class is a wraper arround Denomander app */
export class Lizard {
  /** Holds all the commands defined by the user */
  public allCommands: Array<string> = [];
  /** Holds the main Kernel instance passed in constructor */
  private app: Kernel;

  /** Constructor of the Lizard object */
  constructor(app: Kernel) {
    this.app = app;
  }

  /** Setup all the details of the app at once (name, description, version) */
  public appDetails(app_details: AppDetails) {
    this.app.app_name = app_details.app_name;
    this.app.app_description = app_details.app_description;
    this.app.app_version = app_details.app_version;

    return this;
  }

  /** Setup the name of the app */
  public appName(name: string) {
    this.app.app_name = name;

    return this;
  }

  /** Setup the description of the app */
  public appDescription(description: string) {
    this.app.app_description = description;

    return this;
  }

  /** Setup the version of the app */
  public appVersion(version: string) {
    this.app.app_version = version;

    return this;
  }

  /** Define a command */
  public command(name: string, callback: Function) {
    this.app.command(name).action(callback);
    this.allCommands.push(name);
    return this;
  }

  /** Define a description for the previous defined command */
  public describe(text: string) {
    const command: Command = this.app.commands.slice(-1)[0];
    if (command) {
      command.description = text;
    }
    return this;
  }

  /** Define an option that belongs to the latest defined command */
  public option(flags: string, description: string) {
    const command: Command = this.app.commands.slice(-1)[0];

    if (command) {
      command.addOption({ flags, description });
    }
    return this;
  }

  /** Define a required option that belongs to the latest defined command */
  public requiredOption(flags: string, description: string) {
    const command: Command = this.app.commands.slice(-1)[0];

    if (command) {
      command.addOption({ flags, description, isRequired: true });
    }
    return this;
  }

  /** It is the starting point of the app. It parses the args and executes the code */
  public parse() {
    this.app.parse(Deno.args);
  }
}
