export class ShortCircuitError extends Error {
  constructor() {
    super("Short-circuit evaluation");
    this.name = "ShortCircuitError";
  }
}
