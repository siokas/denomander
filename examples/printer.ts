import Denomander from "../mod.ts";

const program = new Denomander({
  app_name: "My MY App",
  app_description: "My MY Description",
  app_version: "1.0.1",
});

program
  .command("info", "Just an info")
  .action(() => program.print().info("This is an info"));

program
  .command("error", "Just an error")
  .action(() => program.print().error("This is an error"));

program
  .command("success", "Just a success message")
  .action(() => program.print().success("This is a success message"));

program
  .command("warning", "Just a warning")
  .action(() => program.print().warning("This is a warning message"));

program
  .command("lighttheme", "Simple theme print commant")
  .action(() => program.print().lightMode("This is the light mode"));

program
  .command("darktheme", "Simple theme print commant")
  .action(() => program.print().darkMode("This is the dark mode"));

program
  .command("goldentheme", "Simple theme print commant")
  .action(() => program.print().goldenMode("This is the golden mode"));

try {
  program.parse(Deno.args);
} catch (error) {
  console.log(error);
}
