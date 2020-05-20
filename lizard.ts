import { Lizard, program } from "./mod.ts";

Lizard.appDetails({
  app_name: "Lizy",
  app_description: "A new Lizard App",
  app_version: "1.0.0"
});

Lizard.command("clone [url]", clone)
  .option("-c, --color", "the color")
  .describe(
    "this is a description",
  );

Lizard.command('serve', ()=>{
  console.log(program.port);
}).requiredOption('-p --port', 'ppp');

function clone(url: string) {
  console.log("clone from ..." + url);
}

export { Lizard };
