import { assertEquals, test } from "./test_deps.ts";
import Command from "./Command.ts";

test(function command_option() {
  let option = new Command(
    "-h --help",
    "Print command line options (currently set)"
  );

  assertEquals(option.letter_command, "h");
  assertEquals(option.word_command, "help");
  assertEquals(
    option.description,
    "Print command line options (currently set)"
  );
  assertEquals(option.type, "option");
});

test(function command_required_option() {
  let required_option = new Command("-p --port", "Define Port Number", true);

  required_option.value = "8080";

  assertEquals(required_option.letter_command, "p");
  assertEquals(required_option.word_command, "port");
  assertEquals(required_option.description, "Define Port Number");
  assertEquals(required_option.value, "8080");
  assertEquals(required_option.type, "option");
});

test(function command_command() {
  let command = new Command(
    "new [name]",
    "Create a new file",
    false,
    "command"
  );

  command.value = "my_filename";

  assertEquals(command.word_command, "new");
  assertEquals(command.value, "my_filename");
  assertEquals(command.type, "command");
});
