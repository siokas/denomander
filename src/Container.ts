export class Container {
  private static _instance: Container;
  public bindings: any = [];

  public bind(abstract: string, concrete: any) {
    if (this.bindings[abstract] === undefined) {
      this.bindings[abstract] = concrete;
    }
  }

  public resolve(abstract: string) {
    return this.bindings[abstract];
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
