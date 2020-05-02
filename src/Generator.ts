import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import { Util } from "./Util.ts";
import { OnCommand } from "./types.ts";

/**
 * It is responsible for generating the app variables and running the necessary callback functions
 * 
 * @exports
 * @class Generator
 */
export class Generator {
  /**
   * The Arguments instance holding all the arguments passed by the user
   * 
   * @protected
   * @type {Arguments}
   */
  protected args: Arguments;

  /**
   * The instance of the main app
   * 
   * @protected
   * @type {Kernel}
   */
  protected app: Kernel;

  /**
   * Constructor of Generator object.
   * 
   * @param {Kernel} app 
   * @param {Arguments} args 
   */
  constructor(app: Kernel, args: Arguments) {
    this.app = app;
    this.args = args;
  }

  /**
   * It generates the required option app variables. (ex. program.message="initial commit")
   * 
   * @public
   * @returns {Generator}
   */
  public requiredOptionValues(): Generator {
    const commandArgsWithRequiredValues = Util.commandArgsWithRequiredValues(
      this.args,
      this.app,
    );

    commandArgsWithRequiredValues.forEach((arg: string, key: number) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        arg,
      );

      if (command) {
        command.value = this.args.commands[key + 1];
        if (command.word_command) {
          this.app[command.word_command] = command.value;
        }
        this.app.commands = Util.removeCommandFromArray(
          this.app.commands,
          this.args.commands[key + 1],
        );
        delete this.args.commands[key + 1];
      }
    });

    return this;
  }

  /**
   * It generates the command app variables (ex. program.clone="url...")
   * 
   * @public
   * @returns {Generator}
   */
  public commandValues(): Generator {
    this.args.commands.forEach((arg: string) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        arg,
      );
      if (command && !command.require_command_value) {
        if (command.word_command) {
          this.app[command.word_command] = true;
        }
        if (command.letter_command) {
          this.app[command.letter_command] = true;
        }
      }
    });

    return this;
  }

  /**
   * It generates the option app variables (ex. program.force=true)
   * 
   * @public
   * @returns {Generator}
   */
  public optionValues(): Generator {
    for (const key in this.args.options) {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        key,
      );
      if (command && !command.require_command_value) {
        if (command.word_command) {
          this.app[command.word_command] = this.args.options[key];
        }
        if (command.letter_command) {
          this.app[command.letter_command] = this.args.options[key];
        }
      }
    }
    return this;
  }

  /**
   * It calls the .on() method callback functions
   * 
   * @public
   * @returns {Generator}
   */
  public onCommands(): Generator {
    this.app.available_on_commands.forEach((arg: OnCommand) => {
      if (Util.isCommandInArgs(arg.command, this.args)) {
        arg.callback();
      }
    });
    return this;
  }

  /**
   * It calls the .action() method calback function and passes the nessesery parameters
   * 
   * @public
   * @returns {Generator}
   */
  public actionCommands(): Generator {
    this.app.available_actions.forEach((command: Command) => {
      if (Util.isCommandInArgs(command, this.args!)) {
        if (command.action.length == 0) {
          command.action();
        } else if (command.action.length == 1) {
          if (command.word_command) {
            command.action(this.app[command.word_command]);
          }
        }
      }
    });

    return this;
  }
}
