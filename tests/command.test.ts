import { assertEquals, test } from "../deps.ts";
import { Command } from "../src/Command.ts";

test("command_word_command", function () {
  const command = new Command({
    value: "new [name]",
    description: "Create a new file",
  });

  assertEquals(command.word_command, "new");
});
