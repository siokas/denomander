import { assertEquals, assertThrows, test } from "../deno_deps.ts";
import { Denomander } from "../src/Denomander.ts";
import { ValidationError } from "../src/errors.ts";
import * as CustomError from "../custom_errors.ts";

test(function validation_command_with_required_value() {
  const program = new Denomander();
  const args = ["clone"];

  assertThrows(() => {
    program.command("clone [repo]", "Clone the repo").parse(args);
  }, ValidationError, CustomError.VALIDATION_REQUIRED_VALUE_NOT_FOUND.message);
});

test(function validation_required_option() {
  const program = new Denomander();
  const args = ["-p", "8080"];

  assertThrows(
    () => {
      program.requiredOption("-a --address", "Define address").parse(args);
    },
    ValidationError,
    CustomError.VALIDATION_REQUIRED_OPTIONS_NOT_FOUND.message,
  );
});

test(function validation_command_not_defined() {
  const program = new Denomander();
  const command_args = ["test"];

  assertThrows(() => {
    program
      .command("new [filename]", "Generate a new file")
      .parse(command_args);
  }, ValidationError, CustomError.VALIDATION_ARG_NOT_FOUND.message);
});

test(function validation_option_not_defined() {
  const program = new Denomander();
  const optionArgs = ["-a", "127.0.0.1"];

  assertThrows(() => {
    program
      .option("-p --port", "Define port number")
      .parse(optionArgs);
  }, ValidationError, CustomError.VALIDATION_ARG_NOT_FOUND.message);
});
