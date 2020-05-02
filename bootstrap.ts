import { Denomander } from "./src/Denomander.ts";
import { Container } from "./src/Container.ts";
import { Saurus } from "./src/Saurus.ts"

const app = Container.Instance;
app.bind("program", new Denomander());
const program = app.resolve("program");
app.bind("saur", new Saurus(program));
const Saur = app.resolve("saur");

export {app, program, Saur}