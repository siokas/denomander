import { AppDetailsAccessors } from "./interfaces.ts";

/**
 * Accessors of the app name, description and version.
 * 
 * @export default
 * @class AppDetailAccessors
 */
export default class AppDetails implements AppDetailsAccessors {
  /**
   * The name of the app.
   * 
   * @private
   * @type {string}
   * @memberof AppDetails
   */
  private _app_name: string;

  /**
   * The description of the app.
   * 
   * @private
   * @type {string}
   * @memberof AppDetails
   */
  private _app_description: string;

  /**
   * The version of the app.
   * 
   * @private
   * @type {string}
   * @memberof AppDetails
   */
  private _app_version: string;

  /**
   * Constructor of AppDetails object.
   * 
   * @param {AppDetailsAccessors} app_details 
   * @memberof AppDetails
   */
  constructor(app_details?: AppDetailsAccessors) {
    if (app_details) {
      this._app_name = app_details.app_name;
      this._app_description = app_details.app_description;
      this._app_version = app_details.app_version;
    } else {
      this._app_name = "My App";
      this._app_description = "My Description";
      this._app_version = "0.0.1";
    }
  }

  /**
   * Getter of the app name
   * 
   * @public
   * @return {string}
   * @memberof AppDetails
   */
  get app_name(): string {
    return this._app_name;
  }

  /**
   * Setter of the app name
   * 
   * @public
   * @param {string} name
   * @return void
   * @memberof AppDetails
   */
  set app_name(name: string) {
    this._app_name = name;
  }

  /**
   * Getter of the app description
   * 
   * @public
   * @return {string}
   * @memberof AppDetails
   */
  get app_description(): string {
    return this._app_description;
  }

  /**
   * Setter of the app description
   * 
   * @public
   * @param {string} description
   * @return void
   * @memberof AppDetails
   */
  set app_description(description: string) {
    this._app_description = description;
  }

  /**
   * Getter of the app version
   * 
   * @public
   * @return {string}
   * @memberof AppDetails
   */
  get app_version(): string {
    return this._app_version;
  }

  /**
   * Setter of the app version
   * 
   * @public
   * @param {string} version
   * @return void
   * @memberof AppDetails
   */
  set app_version(version: string) {
    this._app_version = version;
  }
}
