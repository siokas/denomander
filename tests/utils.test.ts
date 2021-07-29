import { assertEquals, test } from "../deps.ts";
import Command from "../src/Command.ts";
import {
  arraysHaveMatchingCommand,
  findCommandFromArgs,
} from "../src/utils/find.ts";
import { itContainsBrackets } from "../src/utils/detect.ts";
import {
  removeCommandFromArray,
  removeDashes,
  trimString,
} from "../src/utils/remove.ts";

test("find_command_from_args", function () {
  const commands: Array<Command> = [];
  const arg = "--help";

  commands.push(
    new Command({
      value: "-h --help",
      description: "Print command line options (currently set)",
    }),
  );

  const command = findCommandFromArgs(commands, arg);

  if (command) {
    assertEquals(command.word_command, "help");
  }
});

test("remove_command_from_array", function () {
  const cloneCommand = new Command({
    value: "clone",
    description: "Clone Command",
  });

  const pullCommand = new Command({
    value: "pull",
    description: "Pull Command",
  });

  const commands_before: Array<Command> = [cloneCommand, pullCommand];
  const commands_after: Array<Command> = [cloneCommand];

  assertEquals(removeCommandFromArray(commands_before, "pull"), commands_after);
});

test("arrays_have_matching_command", function () {
  const helpCommand = new Command({
    value: "-h --help",
    description: "Helper of the app",
  });
  const versionCommand = new Command({
    value: "-v --version",
    description: "Version of the app",
  });

  const array1: Array<Command> = [versionCommand, helpCommand];
  const array2: Array<Command> = [helpCommand];

  assertEquals(arraysHaveMatchingCommand(helpCommand, array1, array2), true);
});

test("strip_dashes", function () {
  assertEquals(removeDashes("--test"), "test");
});

test("contains_brackets", function () {
  assertEquals(itContainsBrackets("new [name]"), true);
  assertEquals(itContainsBrackets("start"), false);
});

test("trim_string", function () {
  const value = "  -- port  ";

  assertEquals(trimString(value), "--port");
});
