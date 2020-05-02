import { assertThrows, test } from "../deno_deps.ts";
import { Denomander } from "../src/Denomander.ts";
import * as CustomError from "../custom_errors.ts";

test("validation_command_with_required_value", function () {
  const program = new Denomander();
  const args = ["clone"];

  assertThrows(
    () => {
      program.command("clone [repo]", "Clone the repo").parse(args);
    },
    CustomError.ValidationError,
    CustomError.VALIDATION_REQUIRED_VALUE_NOT_FOUND.message,
  );
});

test("validation_required_option", function () {
  const program = new Denomander();
  const args = ["-p", "8080"];

  assertThrows(
    () => {
      program.requiredOption("-a --address", "Define address").parse(args);
    },
    CustomError.ValidationError,
    CustomError.VALIDATION_REQUIRED_OPTIONS_NOT_FOUND.message,
  );
});

test("validation_command_not_defined", function () {
  const program = new Denomander();
  const command_args = ["test"];

  assertThrows(
    () => {
      program
        .command("new [filename]", "Generate a new file")
        .parse(command_args);
    },
    CustomError.ValidationError,
    CustomError.VALIDATION_ARG_NOT_FOUND.message,
  );
});

test("validation_option_not_defined", function () {
  const program = new Denomander();
  const optionArgs = ["-a", "127.0.0.1"];

  assertThrows(
    () => {
      program
        .option("-p --port", "Define port number")
        .parse(optionArgs);
    },
    CustomError.ValidationError,
    CustomError.VALIDATION_ARG_NOT_FOUND.message,
  );
});
