import Denomander from "../Denomander.ts";

/** The methods that must be implemented for public api */
export interface PublicAPI {
  option(value: string, description: string): Denomander;
  requiredOption(value: string, description: string): Denomander;
  command(value: string, description?: string): Denomander;
  description(description: string): Denomander;
  action(callback: Function): Denomander;
  on(arg: string, callback: Function): Denomander;
  parse(args: Array<string>): void;
}

/** Interface to implement parse() method */
export interface Parasable {
  parse(args: Array<string>): void;
}

/** It sets the contract for the Validator object */
export interface ValidatorContract {
  validate(): void;
}

/** It sets the contract for the Arguments Object */
export interface ArgumentsContract {
  parse(): void;
}
