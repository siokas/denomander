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

async function evaluate() {
  return new Promise(async (resolve, reject) => {
    const p = Deno.run({
      cmd: [
        "deno",
        "eval",
        `${"import {Lizard} from './lizard.ts'; Lizard.parse();"}`
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
run("lizard.ts").then(()=>{
  evaluate();
});
