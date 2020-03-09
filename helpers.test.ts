import { assertEquals, test } from "./test_deps.ts";
import { stripDashes, containsBrackets,
  findCommandFromArgs } from "./helpers.ts";
import Command from "./Command.ts";

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
    new Command("-h --help", "Print command line options (currently set)")
  );

  let command = findCommandFromArgs(commands, arg);

  assertEquals(command!.letter_command, "h");
  assertEquals(command!.word_command, "help");
});
