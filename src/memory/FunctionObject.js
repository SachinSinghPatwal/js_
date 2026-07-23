export class FunctionObject {
  constructor(node, scope) {
    this.type = "FunctionObject";

    this.node = node;
    this.scope = scope;

    this.name = node.id?.name ?? null;
    this.params = node.params;
    this.body = node.body;
  }
}
