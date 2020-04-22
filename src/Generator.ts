import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import * as Interface from "./interfaces.ts";
import * as Utils from "./utils.ts";

/**
 * It is responsible for generating the public variables and running the necessary callback functions
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
   * 
   * @param {} app 
   * @param args 
   */
  constructor(app: Kernel, args: Arguments) {
    this.app = app;
    this.args = args;
  }

  generateRequiredCommandValues() {
    const commandArgsWithRequiredValues = Utils.commandArgsWithRequiredValues(
      this.args,
      this.app,
    );

    commandArgsWithRequiredValues.forEach((arg: string, key: number) => {
      const command: Command | undefined = Utils.findCommandFromArgs(
        this.app.commands,
        arg,
      );

      if (command) {
        command.value = this.args.commands[key + 1];
        this.app[command.word_command!] = command.value;
        this.app.commands = Utils.removeCommandFromArray(
          this.app.commands,
          this.args.commands[key + 1],
        );
        delete this.args.commands[key + 1];
      }
    });
  }

  commandValues() {
    this.args.commands.forEach((arg: string) => {
      const command: Command | undefined = Utils.findCommandFromArgs(
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

  optionValues() {
    for (const key in this.args.options) {
      const command: Command | undefined = Utils.findCommandFromArgs(
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

  onCommands() {
    this.app.available_on_commands.forEach((arg: Interface.OnCommand) => {
      if (Utils.isCommandInArgs(arg.command, this.args)) {
        arg.callback();
      }
    });
    return this;
  }
}
