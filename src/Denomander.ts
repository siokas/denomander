import { Arguments } from "./Arguments.ts";
import { Command } from "./Command.ts";
import { Kernel } from "./Kernel.ts";
import { Util } from "./Util.ts";
import { PublicAPI } from "./interfaces.ts";

/** The main class */
export class Denomander extends Kernel implements PublicAPI {

  /** Parses the args*/
  public parse(args: Array<string>) {
    this.args = new Arguments(args);
    this.args.parse();

    this.run();
  }

  /** Implements the option command */
  public option(value: string, description: string): Denomander {
    const command: Command | undefined = this.commands.slice(-1)[0];

    if (command) {
      command.addOption({ flags: value, description });
    }

    return this;
  }

  /** Implements the required option command */
  public requiredOption(value: string, description: string): Denomander {
    const command: Command | undefined = this.commands.slice(-1)[0];

    if (command) {
      command.addOption({ flags: value, description, isRequired: true });
    }

    return this;
  }

  /* Implements the base option */
  public baseOption(value: string, description: string): Denomander {
    this.BASE_COMMAND.addOption({
      flags: value,
      description,
    });

    return this;
  }

  /** Implements the option command */
  public command(
    value: string,
    description?: string,
    action?: Function,
  ): Denomander {
    const new_command: Command = new Command({
      value,
      description,
    });
    this.commands.push(new_command);

    if (action) {
      this.action(action);
    }

    return this;
  }

  /** Implements the description of the previous mentioned command (by the user) */
  public description(description: string): Denomander {
    const command: Command = this.commands.slice(-1)[0];

    if (command) {
      command.description = description;
    }

    return this;
  }

  /** Implements the action of a command registered by the user */
  public action(callback: Function): Denomander {
    const command: Command = this.commands.slice(-1)[0];

    if (command) {
      command.action = callback;
      this.available_actions.push(command);
    }

    return this;
  }

  /** Implements the .on() option */
  public on(arg: string, callback: Function): Denomander {
    const command: Command | undefined = Util.findCommandFromArgs(
      this.commands,
      arg,
    );

    if (command) {
      command.action = callback;
      this.available_actions.push(command);
    }

    return this;
  }

  /** Lets user to customize the help method */
  public setHelp(command: string, description: string): Denomander {
    this.help_command = new Command({ value: command, description });

    const new_available_default_options = Util.removeCommandFromArray(
      this.commands,
      "help",
    );

    new_available_default_options.push(this.help_command);
    this.available_default_options = new_available_default_options;
    this.isHelpConfigured = true;

    return this;
  }

  /** Lets user to customize the version method */
  public setVersion(
    version: string,
    command: string,
    description: string,
  ): Denomander {
    this.version = version;
    this.version_command = new Command({ value: command, description });

    const new_available_default_options = Util.removeCommandFromArray(
      this.commands,
      "version",
    );

    new_available_default_options.push(this.version_command);
    this.available_default_options = new_available_default_options;
    this.isVersionConfigured = true;

    return this;
  }
}
