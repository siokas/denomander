/* General helper functions */
export class Helper {
  /**
   * It removes dashes from a string
   * 
   * @param {string} text 
   * @return {string}
   */
  static stripDashes(text: string): string {
    return text.replace(/-/g, "");
  }

  /**
   * Detects if a strign contains brackets
   * 
   * @param {string} text 
   * @returns {boolean}
   */
  static containsBrackets(text: string): boolean {
    return text.match(/\[(.*?)\]/) ? true : false;
  }

  /**
   * It trims of the empty spaces from the given string
   * 
   * @param {string} text 
   * @returns {string}
   */
  static trimString(text: string): string {
    return text.replace(/\s/g, "");
  }
}
