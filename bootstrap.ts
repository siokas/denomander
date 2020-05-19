import { Denomander } from "./src/Denomander.ts";
import { Container } from "./src/Container.ts";
import { Lizard as Lizy } from "./src/Lizard.ts";

const app = Container.Instance;

app.bind("program", new Denomander());
const program = app.resolve("program");
app.bind("lizard", new Lizy(program));
const Lizard = app.resolve("lizard");

export { app, program, Lizard };
