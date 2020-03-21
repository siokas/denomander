import { assertEquals, assertThrows, test } from "./test_deps.ts";
import Denomander from "./Denomander.ts";

test(function app_option() {
  let program = new Denomander();
  let args = ["--port", "8080"];

  program.option("-p --port", "Define port number").parse(args);

  assertEquals(program.port, 8080);
});

test(function app_required_option() {
  let program = new Denomander();
  let args = ["-p", "8080", "-a", "192.168.1.100"];
  let args_without_required_option = ["-p", "8080"];

  program
    .option("-p --port", "Define port number")
    .requiredOption("-a --address", "Define address")
    .parse(args);

  assertEquals(program.port, 8080);
  assertEquals(program.address, "192.168.1.100");
  assertThrows(() => {
    program.option("-p --port", "Define port number").requiredOption(
      "-a --address",
      "Define address"
    ).parse(args_without_required_option);
  }, Error, "Required option [address] not specified");
});

test(function app_command() {
  let program = new Denomander();
  let args = ["new", "myFileName"];
  let args2 = ["new"];

  program
    .command("new [filename]", "Generate a new file")
    .parse(args);

  assertEquals(program.new, "myFileName");
  assertThrows(() => {
    program.command("new [filename]", "Generate a new file").parse(args2);
  }, Error, "You have to pass a parameter");
});

test(function app_command_and_option_not_defined() {
  let program = new Denomander();
  let command_args = ["test"];
  let optionArgs = ["-a", "127.0.0.1"];

  assertThrows(() => {
    program.option("-p --port", "Define port number").parse(optionArgs);
  }, Error, "Command [a] not found");
  assertThrows(() => {
    program.command("new [filename]", "Generate a new file").parse(
      command_args
    );
  }, Error, "Command [test] not found");
});

test(function app_change_default_option_command() {
  let program = new Denomander();
  let args = ["-x"];

  program.setVersion(
    "1.8.1",
    "-x --xversion",
    "Display the version of the app"
  ).parse(args);

  assertEquals(program.version, "1.8.1");
});

test(function app_on_command() {
  let program = new Denomander();
  let args = ["-V"];

  let test = false;
  let test2 = false;

  program.on("--version", () => {
    test = true;
  });

  program.on("-h", () => {
    test2 = true;
  });

  program.parse(args);

  assertEquals(test, true);
  assertEquals(test2, false);
});
