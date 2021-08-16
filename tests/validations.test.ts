import { assertThrows, test } from "../deps.ts";
import { Option } from "./../mod.ts";
import Denomander from "../src/Denomander.ts";

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
      program
        .command("serve")
        .requiredOption("-a --address", "Define address")
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
    program.errors.REQUIRED_COMMAND_VALUE_NOT_FOUND,
  );
});

test("validation_default_command_with_required_argument_throws_error", function () {
  const args: string[] = [];

  const program = new Denomander({
    app_name: "myapp", // default command requires app_name.
    throw_errors: true,
  });

  assertThrows(
    () => {
      program.defaultCommand("[from]").parse(args);
    },
    Error,
    program.errors.REQUIRED_VALUE_NOT_FOUND,
  );
});

test("validation_option_choices", function () {
  const program = new Denomander({ throw_errors: true });
  const args = ["choose", "-c", "five"];
  const customOption = new Option({
    flags: "-c --choice",
    description: "Choose one of the following",
  }).choices(["one", "two", "three"]);

  assertThrows(
    () => {
      program.command("choose").addOption(customOption).parse(args);
    },
    Error,
    program.errors.OPTION_CHOICE,
  );
});

test("validation_arg_description", function () {
  const program = new Denomander({ throw_errors: true });
  const args = ["mv . /"];

  assertThrows(
    () => {
      program
        .command("mv [from] [to]")
        .argDescription("from", "Source Folder")
        .argDescription("tos", "Destination Folder") // Deliberatly add a typo to throw an error
        .parse(args);
    },
    Error,
    "tos",
    "You are trying to add a description for the argument tos which is not defined!",
  );
});
