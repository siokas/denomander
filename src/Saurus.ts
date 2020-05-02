import { Kernel } from "./Kernel.ts";

export class Saurus {
    public allcommands:any = [];
    app:Kernel;

    constructor(app:Kernel){
        this.app = app;
    }

  command(name: string, callback: Function, description?: string) {
    this.app.command(name);
    this.allcommands.push(name)
    return this;
  }

  describe(text: string) {
    return this;
  }

  option(flags: string, description: string) {
    return this;
  }

  parse(){
    this.app.parse(Deno.args);
  }
}
