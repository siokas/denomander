import { assertEquals, test } from "../deno_deps.ts";
import { Command } from "../src/Command.ts";

test("command_option", function () {
  const option = new Command({
    value: "-h --help",
    description: "Print command line options (currently set)",
  });

  assertEquals(option.letter_command, "h");
  assertEquals(option.word_command, "help");
  assertEquals(
    option.description,
    "Print command line options (currently set)",
  );
  assertEquals(option.type, "option");
});

test("command_required_option", function () {
  const required_option = new Command(
    {
      value: "-p --port",
      description: "Define Port Number",
      is_required: true,
    },
  );

  required_option.value = "8080";

  assertEquals(required_option.letter_command, "p");
  assertEquals(required_option.word_command, "port");
  assertEquals(required_option.description, "Define Port Number");
  assertEquals(required_option.value, "8080");
  assertEquals(required_option.type, "option");
});

test("command_command", function () {
  const command = new Command({
    value: "new [name]",
    description: "Create a new file",
    is_required: false,
    type: "command",
  });

  command.value = "my_filename";

  assertEquals(command.word_command, "new");
  assertEquals(command.value, "my_filename");
  assertEquals(command.type, "command");
});
