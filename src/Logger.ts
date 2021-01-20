import { blue, green, red, yellow } from "../deps.ts";

/** Prints success message */
export function success_log(text: string): void {
  return colored_output(`✅ ${text}`, "green");
}

/** Prints warning message */
export function warning_log(text: string): void {
  return colored_output(`⚠️ ${text}`, "yellow");
}

/** Prints error message */
export function error_log(text: string): void {
  return colored_output(`❌ ${text}`, "red");
}

/** Handles the output color */
function colored_output(text: string, color: string = "normal") {
  switch (color) {
    case "red":
      console.log(red(text));
      break;

    case "green":
      console.log(green(text));
      break;

    case "yellow":
      console.log(yellow(text));
      break;

    case "blue":
      console.log(blue(text));
      break;

    default:
      console.log(text);
      break;
  }
}
