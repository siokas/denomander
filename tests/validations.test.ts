import { assertEquals, assertThrows, test } from "../deps.ts";
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
