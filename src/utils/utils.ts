/**
 * It detects if the passed flags
 * are seperated by comma, pipe or space
 * and splits them.
 */
export function splitValue(value: string): Array<string> {
  if (value.indexOf(",") !== -1) {
    return value.split(",");
  }

  if (value.indexOf("|") !== -1) {
    return value.split("|");
  }

  return value.split(" ");
}
