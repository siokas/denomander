import { Arguments } from "./Arguments.ts";
import { Command } from "./Command.ts";
import { Kernel } from "./Kernel.ts";
import { PublicAPI } from "./interfaces.ts";
import { CommandOption, VersionType } from "./types.ts";

/** The main class */
export class Denomander extends Kernel implements PublicAPI {
  /** Parses the args*/
  public parse(args: Array<string>) {
    this.args = new Arguments(args);
    this.args.parse();

    this.run();
  }

  /** Implements the option command */
  public option(
    value: string,
    description: string,
    callback?: Function,
    defaultValue?: any,
  ): Denomander {
    const command: Command | undefined = this.commands.slice(-1)[0];

    const defaultArgs: CommandOption = {
      flags: value,
      description,
      callback: callback || undefined,
      defaultValue: defaultValue || undefined,
    };

    command.addOption(defaultArgs);

    return this;
  }

  /** Implements the required option command */
  public requiredOption(
    value: string,
    description: string,
    callback?: Function,
  ): Denomander {
    const command: Command | undefined = this.commands.slice(-1)[0];

    if (command) {
      if (callback) {
        command.addOption(
          { flags: value, description, callback, isRequired: true },
        );
      } else {
        command.addOption({ flags: value, description, isRequired: true });
      }
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

  public globalOption(value: string, description: string): Denomander {
    this.globalOptions.push({ value, description });

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
    this.on_commands.push({ arg, callback });

    return this;
  }

  public alias(...aliases: Array<string>): Denomander {
    const command: Command = this.commands.slice(-1)[0];
    if (command) {
      aliases.forEach((alias) => command.addAlias(alias));
    }

    return this;
  }

  /** Lets user to customize the version method */
  public setVersion(params: VersionType): Denomander {
    this.versionOption.reset(params.flags, params.description);

    if (params.version) {
      this.app_version = params.version;
    }

    return this;
  }
}
