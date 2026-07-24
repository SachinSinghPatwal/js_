export class FunctionObject {
  constructor(node, scope, options = {}) {
    this.type = "FunctionObject";

    // Original AST node
    this.node = node;

    // Scope where this function was declared
    this.scope = scope;
    this.isArrow = Boolean(options.isArrow);
    this.capturedThisValue = options.capturedThisValue;

    // Class-related metadata
    this.homeObject = options.homeObject ?? null;
    this.superClass = options.superClass ?? null;

    // Convenience properties
    this.name = node.id?.name ?? null;
    this.params = node.params;
    this.body = node.body;
    this.prototype = { constructor: this };
  }
}
