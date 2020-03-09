import { stripDashes, containsBrackets } from "./helpers.ts";

export default class Command {
  private _value: string;
  private _description: string;
  private _is_required: boolean;
  private _letter_command: string | undefined;
  private _word_command: string | undefined;
  private _type: "command" | "option";

  require_command_value: boolean = false;

  constructor(
    value: string,
    description: string,
    is_required?: boolean,
    type?: "command" | "option"
  ) {
    this._value = value;
    this._description = description;
    this._is_required = is_required || false;
    this._type = type || "option";

    if (this._type == "option") {
      this.generateOption();
    } else {
      this.generateCommand();
    }
  }

  private generateCommand() {
    let splitedValue = this._value.split(" ");

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
    let splitedValue = this._value.split(" ");

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
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get description(): string {
    return this._description;
  }

  set description(description: string) {
    this._description = description;
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

  get type(): "command" | "option" {
    return this._type;
  }
}
