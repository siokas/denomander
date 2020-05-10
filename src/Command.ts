import { Helper } from "./Helper.ts";
import { CommandOptions } from "./types.ts";
import { Option } from "./Option.ts";
/**
  * Command class 
  * 
  * @export
  * @class Command
 */
export class Command {
  /**
   * If the command has a required value
   * to be passed from the user.
   * 
   * @public
   * @type {boolean}
   */
  public require_command_value = false;

  /**
    * Holds the short flag (-p)
    * One letter command.
    *
    * @private
    * @type {string}
   */
  private _word_command?: string;

  /**
   * Holds the object's options
   * initiated in constructor.
   * 
   * @private
   * @type {CommandOptions}
   */
  private param: CommandOptions;

  public options:Array<Option> = [];

  /**
   * Constructor of Command object.
   * 
   * @param {CommandOptions} options
   */
  constructor(param: CommandOptions) {
    this.param = Object.assign({
      description: "",
      is_required: false,
      action: () => {},
    }, param);

    this.addOption("-h, --help", "Help Screen");

    if (!this.param.value) {
      throw new ReferenceError("You have to specify the command");
    }

      this.generateCommand();
  }

  addOption(flags:string, description:string):Command{
    this.options.push(new Option(flags, description, this));

    return this;
  }

  /**
   * It splits the word command and
   * detects if there is a require command value.
   * 
   * @private
   * @returns void
   */
  private generateCommand() {
    const splitedValue = this.param.value.split(" ");

    switch (splitedValue.length) {
      case 1:
        this._word_command = Helper.stripDashes(splitedValue[0]);
        break;

      case 2:
        this._word_command = Helper.stripDashes(splitedValue[0]);
        if (Helper.containsBrackets(splitedValue[1])) {
          this.require_command_value = true;
        }
        break;
    }
  }

  /**
   * Getter of the command value
   * 
   * @public
   * @returns {string}
   */
  get value(): string {
    return this.param.value;
  }

  /**
   * Setter of the command value
   * 
   * @public
   * @param {string} value
   * @returns void
   */
  set value(value: string) {
    this.param.value = value;
  }

  /**
   * Getter of the command description
   * 
   * @public
   * @returns {string}
   */
  get description(): string {
    return this.param.description || "";
  }

  /**
   * Setter of the command description
   * 
   * @public
   * @param {string} description
   * @returns void
   */
  set description(description: string) {
    this.param.description = description;
  }

  /**
   * Getter of the long flag (word command)
   * 
   * @public
   * @returns {string | undefined}
   */
  get word_command(): string | undefined {
    return this._word_command;
  }

  /**
   * Setter of the long flag (word command)
   * 
   * @public
   * @param {string | undefined} word_command
   * @returns void
   */
  set word_command(word_command: string | undefined) {
    this._word_command = word_command;
  }

  /**
   * Getter of the command action (callback function)
   * 
   * @public
   * @returns {Function | undefined}
   */
  get action(): Function {
    return this.param.action || Function;
  }

  /**
   * Setter of the command action (callback function)
   * 
   * @public
   * @param {Function} callback
   * @returns void
   */
  set action(callback: Function) {
    this.param.action = callback;
  }

  /**
   * Getter of the type of the command
   * 
   * @public
   * @returns {"command" | "option"}
   */
  get type(): "command" | "option" {
    return this.param.type || "option";
  }
}
