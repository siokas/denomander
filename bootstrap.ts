import { Denomander } from "./src/Denomander.ts";
import { Lizard as Lizy } from "./src/Lizard.ts";

const program = new Denomander();
const Lizard = new Lizy(program);

export { program, Lizard };
