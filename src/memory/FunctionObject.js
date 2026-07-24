export class FunctionObject {
  constructor(node, scope, options = {}) {
    this.type = "FunctionObject";

    this.node = node;
    this.scope = scope;
    this.capturedEnvironment = options.capturedEnvironment ?? null;
    this.isArrow = Boolean(options.isArrow);
    this.capturedThisValue = options.capturedThisValue;

    // Class-related metadata
    this.homeObject = options.homeObject ?? null;
    this.superClass = options.superClass ?? null;

    this.name = node.id?.name ?? null;
    this.params = node.params;
    this.body = node.body;
    this.prototype = { constructor: this };
  }
}