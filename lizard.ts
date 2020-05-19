import { Lizard } from "./mod.ts";

Lizard.command("clone [url]", clone)
  .option("-c, --color", "the color")
  .describe(
    "this is a description",
  );

function clone(url:string) {
  console.log("clone from ..." + url);
}

export { Lizard };