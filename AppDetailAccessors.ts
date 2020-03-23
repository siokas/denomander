import { AppDetails } from "./interfaces.ts";

export default class AppDetailAccessors {
  _app_name: string;
  _app_description: string;
  _app_version: string;

  constructor(app_details?: AppDetails | undefined) {
    if (app_details === undefined) {
      this._app_name = "My App";
      this._app_description = "My Description";
      this._app_version = "0.0.1";
    } else {
      this._app_name = app_details.app_name;
      this._app_description = app_details.app_description;
      this._app_version = app_details.app_version;
    }
  }

  get app_name(): string {
    return this._app_name;
  }

  set app_name(name: string) {
    this._app_name = name;
  }

  get app_description(): string {
    return this._app_description;
  }

  set app_description(description: string) {
    this._app_description = description;
  }

  get app_version(): string {
    return this._app_version;
  }

  set app_version(version: string) {
    this._app_version = version;
  }
}
