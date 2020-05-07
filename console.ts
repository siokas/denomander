import { Saur } from "./mod.ts";

Saur.command("clone <url>", clone)
  .option("-c, --color", "the color")
  .describe(
    "this is a description",
  );

function clone() {
  console.log("clone from ...");
}

export { Saur };
