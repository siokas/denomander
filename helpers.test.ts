import { assertEquals, test } from "./test_deps.ts";
import {
  stripDashes,
  containsBrackets,
  findCommandFromArgs,
  removeCommandFromArray,
  arraysHaveMatchingCommand,
  containCommandInOnCommandArray
} from "./helpers.ts";
import Command from "./Command.ts";
import { OnCommand } from "./interfaces.ts";

test(function strip_dashes() {
  assertEquals(stripDashes("--test"), "test");
});

test(function contains_brackets() {
  assertEquals(containsBrackets("new [name]"), true);
  assertEquals(containsBrackets("start"), false);
});

test(function find_command_from_args() {
  let commands: Array<Command> = [];
  let arg = "--help";

  commands.push(
    new Command(
      {
        value: "-h --help",
        description: "Print command line options (currently set)",
      },
    ),
  );

  let command = findCommandFromArgs(commands, arg);

  assertEquals(command!.letter_command, "h");
  assertEquals(command!.word_command, "help");
});

test(function remove_command_from_array() {
  let helpCommand = new Command(
    { value: "-h --help", description: "Helper of the app" },
  );

  let versionCommand = new Command(
    { value: "-v --version", description: "Version of the app" },
  );

  let commands_before: Array<Command> = [helpCommand, versionCommand];
  let commands_after: Array<Command> = [helpCommand];

  assertEquals(
    removeCommandFromArray(commands_before, "version"),
    commands_after,
  );
});

test(function arrays_have_matching_command() {
  let helpCommand = new Command(
    { value: "-h --help", description: "Helper of the app" },
  );
  let versionCommand = new Command(
    { value: "-v --version", description: "Version of the app" },
  );

  let array1: Array<Command> = [versionCommand, helpCommand];
  let array2: Array<Command> = [helpCommand];

  assertEquals(arraysHaveMatchingCommand(helpCommand, array1, array2), true);
});

test(function contain_command_in_on_commands_array() {
  let helpCommand = new Command(
    { value: "-h --help", description: "Helper of the app" },
  );

  let array1: Array<OnCommand> = [
    { command: helpCommand, callback: () => {} },
  ];

  assertEquals(containCommandInOnCommandArray(helpCommand, array1), true);
});
