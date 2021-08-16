import Denomander from "../mod.ts";

const program = new Denomander(
  {
    app_name: "echo",
    app_description: "print a string to stdout",
    app_version: "1.0.1",
    options: {
      help: "classic",
    },
  },
);

program
  .defaultCommand("[msg]")
  .argDescription("msg", "Message to print")
  .description("print a string to stdout")
  .action(({ msg }: any) => {
    console.log(msg);
  });

try {
  program.parse(Deno.args);
} catch (error) {
  console.log(error);
}
