import Denomander from "../mod.ts";

const program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1",
  },
);

function parseInteger(value: string): number {
  return parseInt(value);
}

function upercase(text: string): string {
  return text.toUpperCase();
}

program
  .command("multiply", "Multiply x and y options")
  .option("-x --xnumber", "First Number", parseInteger)
  .option("-y --ynumber", "First Number", parseInteger)
  .action(() => {
    console.log(program.xnumber * program.ynumber);
  });

program
  .command("commit", "Commit Description")
  .requiredOption("-m --message", "Commit Message", upercase)
  .action(() => {
    console.log(program.message);
  });

try {
  program.parse(Deno.args);
} catch (error) {
  console.log(error);
}
