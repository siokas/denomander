import Denomander from "./mod.ts";

const program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1",
  },
);

function pull(url: any) {
  console.log("start pulling from: " + url);
}

program
  .option("-t --test", "Test")
  .command("clone [url]", "clone url")
  .command("pull", "clone url");

program.on("pull", pull);

program.parse(Deno.args);
