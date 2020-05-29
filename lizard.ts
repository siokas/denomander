import { Lizard, program } from "./mod.ts";

Lizard.appDetails({
  app_name: "Lizyxs",
  app_description: "A new Lizard App",
  app_version: "81.0.0",
});

Lizard.command("clone [url]", clone).alias("spar")
  .option("-c, --color", "the color")
  .option("-d, --dcolor", "the color")
  .describe(
    "this is a description",
  );

Lizard.command("pull [repo]", (repo: string) => {
  if (program.force) {
    console.log(`pull from ${repo} with force`);
  } else {
    console.log("Just pull from " + repo);
  }
}).requiredOption("-f --force", "With force").describe(
  "This is a pull command",
);

function clone(url: string) {
  console.log("clone from ..." + url);
}

export { Lizard };
