import Denomander from "./mod.ts";

const program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1",
  },
);

program
  .option("-t --test", "Test")
  .command("clone [url]", "clone url")
  .command("pull", "clone url");

// console.log(program.clone);

program.on("--help", () => {
  console.log("NOT HELP");
});

program.parse(Deno.args);

// if (program.test) {
//   console.log(program.test);
// }
