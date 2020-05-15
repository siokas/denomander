import Denomander from "./mod.ts";

const program = new Denomander({
  app_description: "desc",
  app_name: "name",
  app_version: "0.1.2",
});

program
  .command("serve", "sprize things")
  .option("-s --silent", "silent mode")
  .option("-a --address", "silent mode")
  .action(() => {
    if (program.address) {
      console.log("ok");
    }
  });

program.parse(Deno.args);
