import { blue, green, red, yellow } from "../deps.ts";

export function log(text: string) {
  return colored_output(text, "normal");
}

export function error_log(text: string, command?: string) {
  if (command) {
    const error_text = `❌ Error: ${command} | ${text}`;
    return colored_output(error_text, "red");
  }
  return colored_output("❌ " + text, "red");
}

export function success_log(text: string) {
  return colored_output(text, "green");
}

export function warning_log(text: string) {
  return colored_output("⚠️" + text, "yellow");
}

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
