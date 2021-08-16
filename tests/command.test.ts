import { assertEquals, test } from "../deps.ts";
import Command from "../src/Command.ts";

test("command_word_command", function () {
  const command = new Command({
    value: "new [name]",
    description: "Create a new file",
  });

  assertEquals(command.word_command, "new");
});

test("command_option", function () {
  const command = new Command({
    value: "new [name]",
    description: "Create a new file",
  });

  command.addOption({
    flags: "-p --port",
    description: "Description goes here",
  });

  assertEquals(command.hasOptions(), true);
  assertEquals(command.options[0].word_option, "help");
  assertEquals(command.options[1].word_option, "port");
  assertEquals(command.options[1].isRequired, false);
});

test("command_required_option", function () {
  const command = new Command({
    value: "new [name]",
    description: "Create a new file",
  });

  command.addOption({
    flags: "-p --port",
    description: "Description goes here",
    isRequired: true,
  });

  assertEquals(command.hasOptions(), true);
  assertEquals(command.options[0].word_option, "help");
  assertEquals(command.options[1].word_option, "port");
  assertEquals(command.options[1].isRequired, true);
});

test("command_alias", function () {
  const command = new Command({
    value: "new [name]",
    description: "Create a new file",
  });

  command.addAlias("alias1");
  command.addAlias("alias2");

  assertEquals(command.hasAlias(), true);
  assertEquals(command.aliases, ["alias1", "alias2"]);
});

test("default_command", function () {
  const command = new Command({
    value: "[msg]",
    description: "Print a message",
    isDefault: true,
  });

  assertEquals(command.isDefault, true);
  assertEquals(command.word_command, "[msg]"); // Command name is still the first parameter
});

test("sub_commands", function () {
  const parent_command = new Command({ value: "parent" });
  const sub_command = new Command({
    value: "child",
    subCommand: { parent: parent_command },
  });

  assertEquals(parent_command.hasSubCommands(), true);
  assertEquals(parent_command.subCommands.includes(sub_command), true);
  assertEquals(sub_command.parentCommand, parent_command);
});
