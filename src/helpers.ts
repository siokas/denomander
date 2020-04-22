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
 * It replaces {0}, {1}, {n} with the given variables in a given string 
 * 
 * @param {string} str
 * @param {Array<string>} val
 * @returns {string}
 */
export function format(str: string, ...val: Array<string>): string {
  for (let index = 0; index < val.length; index++) {
    str = str.replace(`{${index}}`, val[index]);
  }

  return str;
}
