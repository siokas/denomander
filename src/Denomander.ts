import { parse } from "../deno_deps.ts";
import { PublicAPI } from "./interfaces.ts";
import { Command } from "./Command.ts";
import { removeCommandFromArray } from "./utils.ts";
import { Kernel } from "./Kernel.ts";

/**
 * The main class 
 * 
 * @export
 * @class Denomander
 * @extends {Kernel}
 * @implements {PublicAPI}
 */
export class Denomander extends Kernel implements PublicAPI {
  /**
   * Parses the args.
   * 
   * @param {Array<string>} args 
   * @memberof PublicAPI
   */
  public parse(args: Array<string>): void {
    this._args = parse(args, { "--": false });

    this.executeProgram();
  }

  /**
   * Implements the option command
   * 
   * @public
   * @param {string} value
   * @param {string} description 
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  public option(value: string, description: string): Denomander {
    this.commands.push(new Command({ value, description }));
    this.available_options.push(new Command({ value, description }));

    return this;
  }

  /**
   * Implements the required option command
   * 
   * @public
   * @param {string} value
   * @param {string} description 
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  public requiredOption(value: string, description: string): Denomander {
    const command: Command = new Command(
      { value, description, is_required: true },
    );
    this.commands.push(command);
    this.available_requiredOptions.push(command);

    return this;
  }

  /**
   * Implements the option command
   * 
   * @public
   * @param {string} value
   * @param {string} description optional
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  public command(value: string, description?: string): Denomander {
    const new_command: Command = new Command({
      value,
      description,
      type: "command",
    });
    this.commands.push(new_command);
    this.available_commands.push(new_command);

    return this;
  }

  /**
   * Implements the description of the previous mentioned command (by the user)
   * 
   * @public
   * @param {string} description 
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  public description(description: string): Denomander {
    const command: Command = this.commands.slice(-1)[0];

    if (command) {
      command.description = description;
    }

    return this;
  }

  /**
   * Implements the action of a command registered by the user
   * 
   * @public
   * @param {Function} callback 
   * @returns {Denomander}
   * @memberof PublicAPI
   */
  public action(callback: Function): Denomander {
    const command: Command = this.commands.slice(-1)[0];

    if (command) {
      command.action = callback;
      this.available_actions.push(command);
    }

    return this;
  }

  /**
   * Implements the .on() option
   * 
   * @public
   * @param {string} arg 
   * @param {Function} callback 
   * @memberof PublicAPI
   */
  public on(arg: string, callback: Function): Denomander {
    this.temp_on_commands.push({ arg, callback });

    return this;
  }

  /**
   * Lets user to customize the help method
   * 
   * @public
   * @param {string} command 
   * @param {string} description 
   * @memberof PublicAPI
   */
  public setHelp(command: string, description: string): Denomander {
    this.help_command = new Command({ value: command, description });

    const new_available_default_options = removeCommandFromArray(
      this.commands,
      "help",
    );

    new_available_default_options.push(this.help_command);
    this.available_default_options = new_available_default_options;
    this.isHelpConfigured = true;

    return this;
  }

  /**
   * Lets user to customize the version method
   *
   * @public
   * @param {string} version  
   * @param {string} command 
   * @param {string} description 
   * @memberof PublicAPI
   */
  public setVersion(
    version: string,
    command: string,
    description: string,
  ): Denomander {
    this.version = version;
    this.version_command = new Command({ value: command, description });

    const new_available_default_options = removeCommandFromArray(
      this.commands,
      "version",
    );

    new_available_default_options.push(this.version_command);
    this.available_default_options = new_available_default_options;
    this.isVersionConfigured = true;

    return this;
  }
}
