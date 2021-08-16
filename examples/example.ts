import { blue, green, red } from "../deps.ts";
import Denomander from "../mod.ts";

const program = new Denomander({
  app_name: "My MY App",
  app_description: "My MY Description",
  app_version: "1.0.1",
  errors: {
    INVALID_RULE: "Invalid Rule",
    OPTION_NOT_FOUND: "Option not found!",
    COMMAND_NOT_FOUND: "Command not found!",
    REQUIRED_OPTION_NOT_FOUND: "Required option is not specified!",
    REQUIRED_VALUE_NOT_FOUND: "Required value is not specified!",
    TOO_MANY_PARAMS: "You have passed too many parameters",
    OPTION_CHOICE: "Invalid option choice!",
    REQUIRED_COMMAND_VALUE_NOT_FOUND:
      "Required command value is not specified!",
    ONLY_ONE_COMMAND_ALLOWED: "Only one command is allowed in default mode!",
  },
});

program
  .baseOption("-q --quiet", "Do not output any message")
  .globalOption("-c --color", "Define the output color");

program
  .command("serve", "Start the server")
  .alias("superserve", "master-server")
  .requiredOption("-p --port", "Define the port")
  .action(() => {
    colored_output("http://localhost:" + program.port);
  });

program
  .command("clone [foldername]")
  .action(({ foldername }: any) => {
    colored_output("The repo is cloned into: " + foldername);
  })
  .description("clone a repo");

program
  .command("mv [from] [to] [message?]")
  .argDescription("from", "Source folder")
  .argDescription("to", "Target folder")
  .argDescription("message", "Message (Optional)")
  .action(({ from, to, message }: any) => {
    colored_output(`File is moved from ${from} to ${to}`);
    if (message) {
      console.log(message);
    }
  })
  .description("move file");

program
  .command("find [args...]")
  .action(({ args }: any) => {
    console.log(`Files to find (${args.length}): `);
    console.log(args);
  })
  .description("find file");

const parent = program.command("parent");

parent
  .subCommand("child1", "test")
  .action(() => {
    console.log("parent + child 1 commands");
  })
  .description("Sub Command Implementation");

parent
  .subCommand("child2", "test")
  .action(() => {
    console.log("parent + child 2 commands");
  })
  .description("Another Sub Command Implementation");

program.on("quiet", () => {
  console.log("Enable Quiet Mode...");
});

try {
  program.parse(Deno.args);
} catch (error) {
  console.log(error);
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
