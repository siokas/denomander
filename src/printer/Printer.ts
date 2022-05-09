import { colors } from "./colors.ts";
/**
 * Console class
 *
 * @exports
 * @class Console
 */
export default class Printer {
  protected css: string;

  constructor() {
    this.css = "";
  }

  public upperCase(message: string) {
    console.log(`%c${message.toUpperCase()}`, this.css);
  }

  public lowerCase(message: string) {
    console.log(`%c${message.toLowerCase()}`, this.css);
  }

  public bold(message?: string) {
    this.css = this.css + "font-weight: bold;";
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public title(message?: string) {
    this.bold().underline();
    message = "✧ " + message;
    if (message) console.log(`%c${message.toUpperCase()}`, this.css);
    return this;
  }

  public subTitle(message?: string) {
    this.italics().blue();
    message = " " + message;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public italics(message?: string) {
    this.css = this.css + "font-style: italic;";
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public underline(message?: string) {
    this.css = this.css + "text-decoration:underline;";
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public lineThrough(message?: string) {
    this.css = this.css + "text-decoration:line-through;";
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgGreen(message?: string) {
    this.css = this.css + `background-color: ${colors.green};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgLightGreen(message?: string) {
    this.css = this.css + `background-color: ${colors.lightGreen};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgBlue(message?: string) {
    this.css = this.css + `background-color: ${colors.blue};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgLightBlue(message?: string) {
    this.css = this.css + `background-color: ${colors.lightBlue};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgRed(message?: string) {
    this.css = this.css + `background-color: ${colors.red};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgLightRed(message?: string) {
    this.css = this.css + `background-color: ${colors.lightRed};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgYellow(message?: string) {
    this.css = this.css + `background-color: ${colors.yellow};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgPink(message?: string) {
    this.css = this.css + `background-color: ${colors.pink};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgLightPink(message?: string) {
    this.css = this.css + `background-color: ${colors.lightPink};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgOrange(message?: string) {
    this.css = this.css + `background-color: ${colors.orange};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgPurple(message?: string) {
    this.css = this.css + `background-color: ${colors.purple};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgGray(message?: string) {
    this.css = this.css + `background-color: ${colors.gray};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgWhite(message?: string) {
    this.css = this.css + `background-color: ${colors.white};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public bgBlack(message?: string) {
    this.css = this.css + `background-color: ${colors.black};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public green(message?: string) {
    this.css = this.css + `color: ${colors.green};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public lightGreen(message?: string) {
    this.css = this.css + `color: ${colors.lightGreen};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public blue(message?: string) {
    this.css = this.css + `color: ${colors.blue};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public lightBlue(message?: string) {
    this.css = this.css + `color: ${colors.lightBlue};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public red(message?: string) {
    this.css = this.css + `color: ${colors.red};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public lightRed(message?: string) {
    this.css = this.css + `color: ${colors.lightRed};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public yellow(message?: string) {
    this.css = this.css + `color: ${colors.yellow};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public pink(message?: string) {
    this.css = this.css + `color: ${colors.pink};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public lightPink(message?: string) {
    this.css = this.css + `color: ${colors.lightPink};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public orange(message?: string) {
    this.css = this.css + `color: ${colors.orange};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public purple(message?: string) {
    this.css = this.css + `color: ${colors.purple};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public gray(message?: string) {
    this.css = this.css + `color: ${colors.gray};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public white(message?: string) {
    this.css = this.css + `color: ${colors.white};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public black(message?: string) {
    this.css = this.css + `color: ${colors.black};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public textColor(color: string, message?: string) {
    this.css = this.css + `color: ${color};`;
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public darkMode(message?: string) {
    this.css = this.css + "background-color: #222f3e; color: #c8d6e5;";
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public lightMode(message?: string) {
    this.css = this.css + "background-color: #c8d6e5; color: #222f3e;";
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public goldenMode(message?: string) {
    this.css = this.css + "background-color: #222f3e; color: #eccc68;";
    if (message) console.log(`%c${message}`, this.css);
    return this;
  }

  public print(message: string) {
    console.log(`%c${message}`, this.css);
  }

  public error(message: string) {
    this.red();
    console.log(`❌ %c${message}`, this.css);
  }

  public success(message: string) {
    this.green();
    console.log(`✅ %c${message}`, this.css);
  }

  public warning(message: string) {
    this.yellow();
    console.log(`⚠️ %c${message}`, this.css);
  }

  public info(message: string) {
    this.blue();
    console.log(`ℹ️ %c${message}`, this.css);
  }
}
