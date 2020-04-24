import { red, green, blue, bold } from "https://deno.land/std/fmt/colors.ts";
import { serve } from "https://deno.land/std/http/server.ts";
import Denomander from "./mod.ts";

const program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1",
  },
);

program
  .command("serve", "Start the server")
  .requiredOption("-p --port", "Define the port")
  .option("-c --color", "Define the color of the output");

program
  .command("clone [foldername]")
  .action((test: any) => {
    console.log("The repo is cloned into: " + test);
  }).description("clone a repo");

program.on("--help", () => {
  console.log("New Help Screen");
  console.log("--- --- ---");
  console.log("-p --port Define port");
});

program.on("--version", () => {
  console.log("New Version are coming next week");
  console.log("v1.5.6");
});

try {
  program.parse(Deno.args);
} catch (error) {
  console.log(error);
}

if (program.serve) {
  let port = program.port || 8080;
  const s = serve({ port: port });

  colored_output("http://localhost:" + port);
}

function colored_output(text: string) {
  if (program.color) {
    switch (program.color) {
      case "red":
        console.log(red(text));
        break;

      case "green":
        console.log(green(text));
        break;

      case "blue":
        console.log(blue(text));
        break;

      default:
        console.log(text);
        break;
    }
  } else {
    console.log(text);
  }
}
