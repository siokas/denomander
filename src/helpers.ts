/**
 * It removes dashes from a string
 * 
 * @param {string} text 
 * @return {string}
 */
export function stripDashes(text: string): string {
  return text.replace(/-/g, "");
}

/**
 * Detects if a strign contains brackets
 * 
 * @param {string} text 
 * @returns {boolean}
 */
export function containsBrackets(text: string): boolean {
  return text.match(/\[(.*?)\]/) ? true : false;
}

/**
 * It trims of the empty spaces from the given string
 * 
 * @param {string} text 
 * @returns {string}
 */
export function trimString(text: string): string {
  return text.replace(/\s/g, "");
}

/**
 * Enum containing the Validation Rules
 * 
 * @export
 * @enum ValidationRules
 */
export enum ValidationRules {
  REQUIRED_OPTIONS,
  REQUIRED_VALUES,
  NON_DECLEARED_ARGS,
  ON_COMMANDS,
  ACTIONS,
}
