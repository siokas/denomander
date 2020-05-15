/* General helper functions */
export class Helper {
  /**
   * It removes dashes from a string
   * 
   * @public
   * @param {string} text 
   * @return {string}
   */
  public static stripDashes(text: string): string {
    return text.substr(0, 2).replace(/-/g, "") +
      text.substr(2, text.length - 1);
  }

  /**
   * Detects if a strign contains brackets
   * 
   * @public
   * @param {string} text 
   * @returns {boolean}
   */
  public static containsBrackets(text: string): boolean {
    return text.match(/\[(.*?)\]/) ? true : false;
  }

  /**
   * It trims of the empty spaces from the given string
   * 
   * @public
   * @param {string} text 
   * @returns {string}
   */
  public static trimString(text: string): string {
    return text.replace(/\s/g, "");
  }
}
