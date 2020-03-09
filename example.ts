import Denomander from "./mod.ts";

let program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1"
  }
);

program
  .command("new [name]", "Generate a new file")
  .option("-a --address", "Define the address")
  .option("-p --port", "Define the port")
  .requiredOption("-s --server", "Server Name")
  .parse(Deno.args);
