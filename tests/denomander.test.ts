import { assertEquals, test } from "../deno_deps.ts";
import { Denomander } from "../src/Denomander.ts";

test("app_option", function () {
  const program = new Denomander();
  const args = ["--port", "8080"];

  program.option("-p --port", "Define port number").parse(args);

  assertEquals(program.port, 8080);
});

test("app_required_option", function () {
  const program = new Denomander();
  const args = ["-p", "8080", "-a", "192.168.1.100"];
  const args_without_required_option = ["-p", "8080"];

  program
    .option("-p --port", "Define port number")
    .requiredOption("-a --address", "Define address")
    .parse(args);

  assertEquals(program.port, 8080);
  assertEquals(program.address, "192.168.1.100");
});

test("app_command", function () {
  const program = new Denomander();
  const args = ["new", "myFileName"];
  const args2 = ["new"];

  program
    .command("new [filename]", "Generate a new file")
    .parse(args);

  assertEquals(program.new, "myFileName");
});

test("app_change_default_option_command", function () {
  const program = new Denomander();
  const args = ["-x"];

  program.setVersion(
    "1.8.1",
    "-x --xversion",
    "Display the version of the app",
  ).parse(args);

  assertEquals(program.version, "1.8.1");
});

test("app_on_command", function () {
  const program = new Denomander();
  const args = ["--version"];

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

test("action_command", function () {
  const program = new Denomander();
  const args = ["clone", "test"];

  let result = "";

  program.command("clone [foldername]").action((foldername: string) => {
    result = foldername;
  });

  program.parse(args);

  assertEquals(result, "test");
});
