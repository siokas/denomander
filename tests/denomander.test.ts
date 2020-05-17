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

test("app_command", function () {
  const program = new Denomander();
  const args = ["new", "myFileName"];
  const args2 = ["new"];

  program
    .command("new [filename]", "Generate a new file")
    .parse(args);

  assertEquals(program.new, "myFileName");
});

// test("app_change_default_option_command", function () {
//   const program = new Denomander();
//   const args = ["-x"];

//   program.setVersion(
//     "1.8.1",
//     "-x --xversion",
//     "Display the version of the app",
//   ).parse(args);

//   assertEquals(program.xversion, "1.8.1");
// });

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
  .action((foldername: any) => {
      console.log('.....................' + foldername)
    result = foldername;
  });

  program.parse(args);

  assertEquals(result, "githubtest");
});
