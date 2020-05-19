import { Lizard } from "./lizard.ts";

async function run(file: string) {
  return new Promise(async (resolve, reject) => {
    const p = Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-run",
        `${file}`,
      ],
      stdout: "piped",
      stderr: "piped",
    });

    const { code } = await p.status();

    if (code === 0) {
      const rawOutput = await p.output();
      await Deno.stdout.write(rawOutput);
      resolve();
    } else {
      const rawError = await p.stderrOutput();
      const errorString = new TextDecoder().decode(rawError);
      console.log(errorString);
      reject();
    }
  });
}

await run("./lizard.ts");
Lizard.parse();
