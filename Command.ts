import { stripDashes, containsBrackets } from "./helpers.ts";

export default class Command {
  private _letter_command: string | undefined;
  private _word_command: string | undefined;
  private options: {
    value: string;
    description: string;
    is_required: boolean;
    type: "command" | "option";
    action: Function;
  };

  require_command_value: boolean = false;

  constructor(
    options: {
      value: string;
      description?: string;
      is_required?: boolean;
      type?: "command" | "option";
      action?: Function;
    },
  ) {
    this.options = Object.assign({
      description: "",
      is_required: false,
      type: "option",
      action: () => {},
    }, options);

    if (!this.options.value) {
      throw new ReferenceError("You have to specify the command");
    }

    if (this.options.type == "option") {
      this.generateOption();
    } else {
      this.generateCommand();
    }
  }

  private generateCommand() {
    let splitedValue = this.options.value.split(" ");

    switch (splitedValue.length) {
      case 1:
        this._word_command = stripDashes(splitedValue[0]);
        break;

      case 2:
        this._word_command = stripDashes(splitedValue[0]);
        if (containsBrackets(splitedValue[1])) {
          this.require_command_value = true;
        }
        break;
    }
  }

  private generateOption() {
    let splitedValue = this.options.value.split(" ");

    switch (splitedValue.length) {
      case 1:
        if (stripDashes(splitedValue[0]).length === 1) {
          this._letter_command = stripDashes(splitedValue[0]);
        } else {
          this._word_command = stripDashes(splitedValue[0]);
        }
        break;

      case 2:
        if (stripDashes(splitedValue[0]).length === 1) {
          this._letter_command = stripDashes(splitedValue[0]);

          if (stripDashes(splitedValue[1]).length > 1) {
            this._word_command = stripDashes(splitedValue[1]);
          }
        } else {
          this._word_command = stripDashes(splitedValue[0]);
        }
        break;

      default:
        break;
    }
  }

  get value(): string {
    return this.options.value;
  }

  set value(value: string) {
    this.options.value = value;
  }

  get description(): string {
    return this.options.description;
  }

  set description(description: string) {
    this.options.description = description;
  }

  get letter_command(): string | undefined {
    return this._letter_command;
  }

  set letter_command(letter_command: string | undefined) {
    this._letter_command = letter_command;
  }

  get word_command(): string | undefined {
    return this._word_command;
  }

  set word_command(word_command: string | undefined) {
    this._word_command = word_command;
  }

  get action(): Function {
    return this.options.action;
  }

  set action(callback: Function) {
    this.options.action = callback;
  }

  get type(): "command" | "option" {
    return this.options.type;
  }
}
