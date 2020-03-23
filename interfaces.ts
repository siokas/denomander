import Command from "./Command.ts";

export interface Commander {
  value: string;
  description: string;
  is_required: boolean;
  type: "command" | "option";
  action: Function;
}

export interface AppDetails {
  app_name: string;
  app_description: string;
  app_version: string;
}

export interface OnCommand {
  command: Command;
  callback: Function;
}

export interface TempOnCommand {
  arg: string;
  callback: Function;
}
