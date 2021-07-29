import Arguments from "../Arguments.ts";
import Option from "../Option.ts";

/** Sets the option value */
export function setOptionValue(option: Option, args: Arguments) {
  for (const key in args.options) {
    if (key == option.word_option || key == option.letter_option) {
      return args.options[key];
    }
  }
}
