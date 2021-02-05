import { assertEquals, test } from "../deps.ts";
import { Denomander } from "../src/Denomander.ts";

test("app_option", function () {
  const program = new Denomander();
  const args = ["serve", "--port=8080"];

  program.command("serve").option("-p --port", "Define port number").parse(
    args,
  );

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
  const args = ["clone", "githubtest"];

  let result = "";

  program
    .command("clone [foldername]")
    .action(({ foldername }: any) => {
      result = foldername;
    });

  program.parse(args);

  assertEquals(result, "githubtest");
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

  program.command("foo [bar]", "Foo")
    .action(({ bar }: any) => {
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

  program1.command("foo").option("-d --default", "Default Value", undefined, 1)
    .parse(argsNoOption);
  program2.command("foo").option("-d --default", "Default Value", undefined, 1)
    .parse(argsWithOption);

  assertEquals(program1.default, 1);
  assertEquals(program2.default, 2);
});
