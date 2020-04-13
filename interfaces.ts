import { Command } from "./Command.ts";
import { Denomander } from "./Denomander.ts";

export interface PublicAPI {
  option(value: string, description: string): Denomander;
  requiredOption(value: string, description: string): Denomander;
  command(value: string, description?: string): Denomander;
  description(description: string): Denomander;
  action(callback: Function): Denomander;
  on(arg: string, callback: Function): Denomander;
  setHelp(command: string, description: string): Denomander;
  setVersion(version: string, command: string, description: string): Denomander;
}

/**
 * Interface to implement parse() method.
 * 
 * @export 
 * @interface Parasable
 */
export interface Parasable {
  parse(args: any): void;
}

/**
 * Defines the app detail types
 * 
 * @export 
 * @interface AppDetailsAccessors
 */
export interface AppDetailsAccessors {
  app_name: string;
  app_description: string;
  app_version: string;
}

/**
 * Defines the .on() command options.
 * 
 * @export 
 * @interface OnCommand
 */
export interface OnCommand {
  command: Command;
  callback: Function;
}

/**
 * Defines the temporary on command options.
 * 
 * @export 
 * @interface TempOnCommand
 */
export interface TempOnCommand {
  arg: string;
  callback: Function;
}

/**
 * Defines the Command object options
 * 
 * @export 
 * @interface CommandOptions
 */
export interface CommandOptions {
  value: string;
  description?: string;
  is_required?: boolean;
  type?: "command" | "option";
  action?: Function;
}
