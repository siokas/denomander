import { assertEquals, test } from "../deps.ts";
import Denomander, { Option } from "../mod.ts";

test("app_option", function () {
  const program = new Denomander();
  const args = ["serve", "--port=8080"];

  program
    .command("serve")
    .option("-p --port", "Define port number")
    .parse(args);

  assertEquals(program.port, 8080);
});

test("app_required_option", function () {
  const program = new Denomander();
  const args = ["serve", "--port=8080", "--address=192.168.1.100"];

  program
    .command("serve")
    .requiredOption("-a --address", "Define address")
    .option("-p --port", "Define port number")
    .parse(args);

  assertEquals(program.port, 8080);
  assertEquals(program.address, "192.168.1.100");
});

test("app_on_command", function () {
  const program = new Denomander();

  program.command("serve");

  const args = ["serve"];

  let test = false;

  program.on("serve", () => {
    test = true;
  });

  program.parse(args);

  assertEquals(test, true);
});

test("action_command", function () {
  const program = new Denomander();
  const args = ["clone", "--branch=main", "githubtest"];

  let result = {
    foldername: "",
    branch: "",
  };

  program
    .command("clone [foldername]")
    .option("-b --branch", "Branch to clone")
    .action(({ foldername }: any, { branch }: any) => {
      result.foldername = foldername;
      result.branch = branch;
    });

  program.parse(args);

  assertEquals(result.foldername, "githubtest");
  assertEquals(result.branch, "main");
});

test("option_processing", function () {
  const program = new Denomander();
  const args = ["upper", "--message=test"];

  let uppercaseMessage = "";
  const uppercase = (text: string): string => {
    return text.toUpperCase();
  };

  program
    .command("upper", "Make string uprcase")
    .requiredOption("-m --message", "Message to convert", uppercase)
    .action(() => {
      uppercaseMessage = program.message;
    });

  program.parse(args);

  assertEquals(uppercaseMessage, "TEST");
});

test("alias", function () {
  const program = new Denomander();
  const args = ["aliasClone", "githubtest"];

  let result = "";

  program
    .command("clone [foldername]")
    .alias("aliasClone")
    .action(({ foldername }: any) => {
      result = foldername;
    });

  program.parse(args);

  assertEquals(result, "githubtest");
});

test("command_argument_parse_number_0", function () {
  const program = new Denomander();
  const args = ["foo", "0"];

  let result = 1;

  program.command("foo [bar]", "Foo").action(({ bar }: any) => {
    result = bar;
  });

  program.parse(args);

  assertEquals(result, 0);
});

test("default_option_value", function () {
  const program1 = new Denomander();
  const program2 = new Denomander();
  const argsNoOption = ["foo"];
  const argsWithOption = ["foo", "-d", "2"];

  program1
    .command("foo")
    .option("-d --default", "Default Value", undefined, 1)
    .parse(argsNoOption);
  program2
    .command("foo")
    .option("-d --default", "Default Value", undefined, 1)
    .parse(argsWithOption);

  assertEquals(program1.default, 1);
  assertEquals(program2.default, 2);
});

test("custom_option_object", function () {
  const program = new Denomander();
  const args = ["foo", "-m", "test"];

  const messageOption = new Option({
    flags: "-m --message",
    description: "A nice description!",
    isRequired: false,
    callback: (message: string) => message.toUpperCase(),
  });

  program.command("foo").addOption(messageOption).parse(args);

  assertEquals(program.message, "TEST");
});

test("command_has_rest_options", function () {
  const program = new Denomander();
  const args = ["file", "file1", "file2", "file3"];
  let found: any = [];

  program
    .command("file [args...]")
    .action(({ args }: any) => {
      found = args;
    })
    .parse(args);

  assertEquals(found.length, 3);
  assertEquals(found, ["file1", "file2", "file3"]);
});
