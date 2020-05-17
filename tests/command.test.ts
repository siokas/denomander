import { assertEquals, test } from "../deps.ts";
import { Command } from "../src/Command.ts";

test("command_command", function () {
  const command = new Command({
    value: "new [name]",
    description: "Create a new file",
  });

  command.value = "my_filename";

  assertEquals(command.word_command, "new");
});
