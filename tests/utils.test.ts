import { assertEquals, test } from "../deps.ts";
import { Util } from "../src/Util.ts";
import { Command } from "../src/Command.ts";
import { OnCommand } from "../src/types.ts";

test("find_command_from_args", function () {
  const commands: Array<Command> = [];
  const arg = "--help";

  commands.push(
    new Command(
      {
        value: "-h --help",
        description: "Print command line options (currently set)",
      },
    ),
  );

  const command = Util.findCommandFromArgs(commands, arg);

  if (command) {
    assertEquals(command.word_command, "help");
  }
});

test("remove_command_from_array", function () {
  const cloneCommand = new Command(
    { value: "clone", description: "Clone Command" },
  );

  const pullCommand = new Command(
    { value: "pull", description: "Pull Command" },
  );

  const commands_before: Array<Command> = [cloneCommand, pullCommand];
  const commands_after: Array<Command> = [cloneCommand];

  assertEquals(
    Util.removeCommandFromArray(commands_before, "pull"),
    commands_after,
  );
});

test("arrays_have_matching_command", function () {
  const helpCommand = new Command(
    { value: "-h --help", description: "Helper of the app" },
  );
  const versionCommand = new Command(
    { value: "-v --version", description: "Version of the app" },
  );

  const array1: Array<Command> = [versionCommand, helpCommand];
  const array2: Array<Command> = [helpCommand];

  assertEquals(
    Util.arraysHaveMatchingCommand(helpCommand, array1, array2),
    true,
  );
});
