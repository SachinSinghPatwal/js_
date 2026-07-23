export class FunctionObject {
  constructor(node, scope) {
    this.type = "FunctionObject";

    // Original AST node
    this.node = node;

    // Scope where this function was declared
    this.scope = scope;

    // Convenience properties
    this.name = node.id?.name ?? null;
    this.params = node.params;
    this.body = node.body;
  }
}
