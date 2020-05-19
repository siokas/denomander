/* General helper functions */
export class Helper {
  /** It removes dashes from a string */
  public static stripDashes(text: string): string {
    return text.replace(/-/g, "");
  }

  /** Detects if a strign contains brackets */
  public static containsBrackets(text: string): boolean {
    return text.match(/\[(.*?)\]/) ? true : false;
  }

  /** It trims of the empty spaces from the given string */
  public static trimString(text: string): string {
    return text.replace(/\s/g, "");
  }

  public static noDashesTrimSpaces(text: string) {
    return Helper.stripDashes(Helper.trimString(text));
  }
}
