import { assertEquals, test } from "../deno_deps.ts";
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
    assertEquals(command.letter_command, "h");
    assertEquals(command.word_command, "help");
  }
});

test("remove_command_from_array", function () {
  const helpCommand = new Command(
    { value: "-h --help", description: "Helper of the app" },
  );

  const versionCommand = new Command(
    { value: "-v --version", description: "Version of the app" },
  );

  const commands_before: Array<Command> = [helpCommand, versionCommand];
  const commands_after: Array<Command> = [helpCommand];

  assertEquals(
    Util.removeCommandFromArray(commands_before, "version"),
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

test("contain_command_in_on_commands_array", function () {
  const helpCommand = new Command(
    { value: "-h --help", description: "Helper of the app" },
  );

  const array1: Array<OnCommand> = [
    { command: helpCommand, callback: () => {} },
  ];

  assertEquals(Util.containCommandInOnCommandArray(helpCommand, array1), true);
});
