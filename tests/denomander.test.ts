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
    .action((foldername: string) => {
      result = foldername;
    });

  program.parse(args);

  assertEquals(result, "githubtest");
});
