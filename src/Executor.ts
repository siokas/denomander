import { Arguments } from "./Arguments.ts";
import { Kernel } from "./Kernel.ts";
import { Command } from "./Command.ts";
import { Util } from "./Util.ts";
import { CommandArgument, ValidationRules } from "./types.ts";
import { Helper } from "./Helper.ts";
import { Option } from "./Option.ts";
import { Validator } from "./Validator.ts";

/** It is responsible for generating the app variables and running the necessary callback functions */
export class Executor {
  /** User have the option to throw the errors */
  public throw_errors: boolean;

  /** The Arguments instance holding all the arguments passed by the user */
  protected args: Arguments;

  /** The instance of the main app */
  protected app: Kernel;

  /** Constructor of Executor object. */
  constructor(app: Kernel, args: Arguments, throw_errors: boolean) {
    this.app = app;
    this.args = args;
    this.throw_errors = throw_errors;
  }

  /** It prints the help screen and creates public app properties based on the name of the option */
  public defaultCommands(): Executor {
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
            }
          });
        }
      });
    }

    return this;
  }

  /** It generates the command app variables (ex. program.clone="url...") */
  public commandValues(): Executor {
    new Validator({
      app: this.app,
      args: this.args,
      rules: [ValidationRules.REQUIRED_VALUES],
      throw_errors: this.throw_errors,
    }).validate();

    this.args.commands.forEach((arg: string, key: number) => {
      const command: Command | undefined = Util.findCommandFromArgs(
        this.app.commands,
        arg,
      );
      if (command && command.word_command) {
        this.app[command.word_command] = true;

        command.command_arguments.forEach((commandArg: CommandArgument) => {
          if (commandArg.argument.includes("...")) {
            commandArg.value = this.args.commands.splice(1);
            if (commandArg.value) {
              this.app[commandArg.argument] = commandArg.value;
            }
          } else {
            commandArg.value = this.args.commands[key + 1];
            this.args.commands.splice(key + 1, 1);

            if (commandArg.value) {
              this.app[commandArg.argument] = commandArg.value;
            }
          }
        });
      }
    });

    return this;
  }

  /** It generates the option app variables (ex. program.force=true) */
  public optionValues(): Executor {
    new Validator({
      app: this.app,
      args: this.args,
      rules: [
        ValidationRules.NON_DECLEARED_ARGS,
        ValidationRules.REQUIRED_OPTIONS,
        ValidationRules.OPTION_CHOICES,
      ],
      throw_errors: this.throw_errors,
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
              if (option.callback) {
                option.value = option.callback(option.value);
              }
              this.app[option.word_option] = option.value;
              this.app[command.word_command] = option.value;
            }
          }
        });
      }
    }
    return this;
  }

  public defaultOptionValues(): Executor {
    this.app.commands.map((command: Command) => {
      command.options.map((option: Option) => {
        if (option.hasDefaultValue()) {
          if (option.callback) {
            option.value = option.callback(option.defaultValue);
          } else {
            option.value = option.defaultValue;
          }
          this.app[option.word_option] = option.value;
        }
      });
    });
    return this;
  }

  /** It calls the .on() method callback functions */
  public onCommands(): Executor {
    new Validator({
      app: this.app,
      args: this.args,
      rules: [ValidationRules.ON_COMMANDS],
      throw_errors: this.throw_errors,
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

      if (option && Util.optionIsInArgs(option, this.args)) {
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

  /** It calls the .action() method calback function and passes the necessary parameters */
  public actionCommands(): Executor {
    this.app.available_actions.forEach((command: Command) => {
      if (this.args) {
        if (Util.isCommandInArgs(command, this.args)) {
          if (command.command_arguments.length == 0) {
            command.action(this.app);
          } else {
            let params: any = {};
            command.command_arguments.forEach((commandArg: CommandArgument) => {
              if (commandArg.argument.includes("...")) {
                const argument = commandArg.argument.substring(
                  0,
                  commandArg.argument.indexOf("..."),
                );
                params[argument] = commandArg.value;
              }
              params[commandArg.argument] = commandArg.value;
            });

            command.action(params, this.app);
          }
        }
      }
    });

    return this;
  }
}
