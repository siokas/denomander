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
  .command("add [title]", "Multiply x and y options")
  .action((note:any) => {
    //   const [title, body] = note.split(":");
      console.log(note.title);
  })

try {
  program.parse(Deno.args);
} catch (error) {
  console.log(error);
}
