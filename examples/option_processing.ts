import Denomander, { Option } from "../mod.ts";

const program = new Denomander(
  {
    app_name: "My MY App",
    app_description: "My MY Description",
    app_version: "1.0.1",
  },
);

function parseInteger(value: string): number {
  return parseInt(value);
}

function upercase(text: string): string {
  return text.toUpperCase();
}

program
  .command("multiply", "Multiply x and y options")
  .option("-x --xnumber", "First Number", parseInteger)
  .option("-y --ynumber", "First Number", parseInteger)
  .action(() => {
    console.log(program.xnumber * program.ynumber);
  });

program
  .command("commit", "Commit Description")
  .requiredOption("-m --message", "Commit Message", upercase)
  .action(() => {
    console.log(program.message);
  });

program
  .command("foo", "Foo Test")
  .option("-d --default", "Default Value", upercase, "bar")
  .action(() => {
    console.log(program.default);
  });

program
  .command("test")
  .addOption(new Option({
    flags: "-m --message",
    description: "TEST DESCRIPTIONM",
  }).default("default message"))
  .action(() => {
    console.log(program.message);
  });

const nameOption = new Option({
  flags: "-n --name",
  description: " Enter your name",
  isRequired: false,
  callback: (name: string) => name.toUpperCase(),
  defaultValue: "james bond",
});

const ageOption = new Option({
  flags: "-a --age",
  description: " Enter your age",
})
  .isRequired(false)
  .callback((age: string) => parseInteger(age))
  .default(30);

program.command("find").addOption(nameOption, ageOption).action(() =>
  console.log(program.name + " " + program.age)
);

const fruits = new Option({
  flags: "-f --fruits",
  description: "Choose one of accepted choises",
}).choises(["apple", "banana", "orange"]);

program.command("choose").addOption(fruits).action(() => {
  console.log(`You choose ${program.fruits}`);
});

try {
  program.parse(Deno.args);
} catch (error) {
  console.log(error);
}
