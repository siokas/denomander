/* General helper functions */
export class Helper {
  /** It removes dashes from a string */
  public static stripDashes(text: string): string {
    return text.substr(0, 2).replace(/-/g, "") +
      text.substr(2, text.length - 1);
  }

  /** It removes dashes from a string */
  public static stripBrackets(text: string): string {
    return text.replace(/\[/g, "").replace(/\]/g, "");
  }

  /** It removes dashes from a string */
  public static stripQuestionMark(text: string): string {
    return text.replace(/\?/g, "");
  }

  /** Detects if a strign contains brackets */
  public static containsBrackets(text: string): boolean {
    return text.match(/\[(.*?)\]/) ? true : false;
  }

  /** Detects if a strign contains curly brackets */
  public static containsCurlyBrackets(text: string): boolean {
    return text.match(/\{(.*?)\}/) ? true : false;
  }

  /** Detects if a strign contains curly brackets */
  public static containsQuestionMark(text: string): boolean {
    return text.match(/\?/) ? true : false;
  }

  /** It trims of the empty spaces from the given string */
  public static trimString(text: string): string {
    return text.replace(/\s/g, "");
  }

  public static noDashesTrimSpaces(text: string) {
    return Helper.stripDashes(Helper.trimString(text));
  }
}
