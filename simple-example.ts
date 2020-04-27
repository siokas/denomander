import Denomander from "./mod.ts";

const program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1",
  },
);

program
  .command("clone [foldername]")
  .action((test: any) => {
    console.log("The repo is cloned into: " + test);
  })
  .description("clone a repo")
  .parse(Deno.args);
