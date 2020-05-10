import Denomander from "./mod.ts";

const program = new Denomander({
    app_description: "desc",
    app_name: "name",
    app_version: "0.1.2"
});

program.command('spar', 'sprize things').option('-s, --scilent', 'silenct mode').parse(Deno.args);