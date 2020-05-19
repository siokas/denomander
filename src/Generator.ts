import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import { Util } from "./Util.ts";
import { OnCommand, ValidationRules } from "./types.ts";
import { Helper } from "./Helper.ts";
import { Option } from "./Option.ts";
import { Validator } from "./Validator.ts";

/** It is responsible for generating the app variables and running the necessary callback functions */
export class Generator {
  /** The Arguments instance holding all the arguments passed by the user */
  protected args: Arguments;

  /** The instance of the main app */
  protected app: Kernel;

  /** Constructor of Generator object. */
  constructor(app: Kernel, args: Arguments) {
    this.app = app;
    this.args = args;
  }

  public defaultCommands(): Generator {
    if (this.args) {
      this.args.commands.forEach((argCommand) => {
        const command = Util.findCommandFromArgs(this.app.commands, argCommand);

        if (command) {
          command.options.forEach((option: Option) => {
            option.value = Util.setOptionValue(option, this.args!);

            if (Util.optionIsInArgs(option, this.args!)) {
              if (option.word_option == "help") {
                Util.printCommandHelp(command!);
                Deno.exit(0);
              }

              this.app[option.word_option] = option.value;
            }
          });
        }
      });
    }

    return this;
  }

  /** It generates the required option app variables. (ex. program.message="initial commit") */
  public requiredOptionValues(): Generator {
    new Validator({
      app: this.app,
      args: this.args,
      rules: [
        ValidationRules.REQUIRED_OPTIONS,
      ],
    }).validate();

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

  /** It generates the command app variables (ex. program.clone="url...") */
  public commandValues(): Generator {
    new Validator({
      app: this.app,
      args: this.args,
      rules: [
        ValidationRules.REQUIRED_VALUES,
      ],
    }).validate();

    this.args.commands.forEach((arg: string) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        arg,
      );
      if (command && command.word_command) {
        if (command.require_command_value) {
          this.app[command.word_command] = command.value;
        } else {
          this.app[command.word_command] = true;
        }
      }
    });

    return this;
  }

  /** It generates the option app variables (ex. program.force=true) */
  public optionValues(): Generator {
    new Validator({
      app: this.app,
      args: this.args,
      rules: [
        ValidationRules.NON_DECLEARED_ARGS,
      ],
    }).validate();
    for (const key in this.args.options) {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        this.args.commands[0],
      );

      if (command) {
        command.options.forEach((option: Option) => {
          if (option.word_option === key || option.letter_option === key) {
            if (command.word_command) {
              option.value = this.args.options[key];
              this.app[command.word_command] = this.args.options[key];
            }
          }
        });
      }
    }
    return this;
  }

  /** It calls the .on() method callback functions */
  public onCommands(): Generator {
    new Validator({
      app: this.app,
      args: this.args,
      rules: [
        ValidationRules.ON_COMMANDS,
      ],
    }).validate();

    this.app.on_commands.forEach((onCommand) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        onCommand.arg,
      );

      const option: Option | undefined = Util.findOptionFromArgs(
        this.app.BASE_COMMAND.options,
        Helper.noDashesTrimSpaces(onCommand.arg),
      );

      if (command) {
        command.action = onCommand.callback;
        this.app.available_actions.push(command);
      }

      if (option) {
        if (this.args.options[option.word_option]) {
          onCommand.callback(this.args.options[option.word_option]);
        }
        if (option.letter_option && this.args.options[option.letter_option]) {
          onCommand.callback(this.args.options[option.letter_option]);
        }
        Deno.exit(0);
      }
    });

    return this;
  }

  /** It calls the .action() method calback function and passes the nessesery parameters */
  public actionCommands(): Generator {
    this.app.available_actions.forEach((command: Command) => {
      if (Util.isCommandInArgs(command, this.args!)) {
        if (command.action.length == 0) {
          command.action();
        } else if (command.action.length == 1) {
          if (command.word_command) {
            command.action(command.value);
          }
        }
      }
    });

    return this;
  }
}
