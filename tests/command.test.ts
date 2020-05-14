import { assertEquals, test } from "../deno_deps.ts";
import { Command } from "../src/Command.ts";

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
