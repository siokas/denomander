import { assertEquals, assertThrows, test } from "../deps.ts";
import { Option } from "./../mod.ts";
import { Denomander } from "../src/Denomander.ts";

test("validation_option_not_found_throws_error", function () {
  const program = new Denomander({ throw_errors: true });
  const optionArgs = ["serve", "-a", "127.0.0.1"];

  assertThrows(
    () => {
      program
        .command("serve")
        .option("-p --port", "Define port number")
        .parse(optionArgs);
    },
    Error,
    program.errors.OPTION_NOT_FOUND,
  );
});

test("validation_command_not_found_throws_error", function () {
  const program = new Denomander({ throw_errors: true });
  const optionArgs = ["wrongCommand", "-p", "80"];

  assertThrows(
    () => {
      program
        .command("serve")
        .option("-p --port", "Define port number")
        .parse(optionArgs);
    },
    Error,
    program.errors.COMMAND_NOT_FOUND,
  );
});

test("validation_required_option_throws_error", function () {
  const program = new Denomander({ throw_errors: true });
  const args = ["serve"];

  assertThrows(
    () => {
      program.command("serve").requiredOption("-a --address", "Define address")
        .parse(args);
    },
    Error,
    program.errors.REQUIRED_OPTION_NOT_FOUND,
  );
});

test("validation_command_with_required_argument_throws_error", function () {
  const program = new Denomander({ throw_errors: true });
  const args = ["clone"];

  assertThrows(
    () => {
      program.command("clone [repo]", "Clone the repo").parse(args);
    },
    Error,
    program.errors.REQUIRED_VALUE_NOT_FOUND,
  );
});

test("validation_option_choises", function () {
  const program = new Denomander({ throw_errors: true });
  const args = ["choose", "-c", "five"];
  const customOption = new Option({
    flags: "-c --choise",
    description: "Choose one of the following",
  }).choises(["one", "two", "three"]);

  assertThrows(
    () => {
      program.command("choose").addOption(customOption).parse(args);
    },
    Error,
    program.errors.OPTION_CHOISE,
  );
});
