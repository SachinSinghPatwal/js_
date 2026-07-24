import { evaluateExpression } from "./evaluateExpression.js";
import { ShortCircuitError } from "./ShortCircuitError.js";

export function evaluateChainExpression(node, executionContextStack, heap) {
  try {
    return evaluateExpression(node.expression, executionContextStack, heap);
  } catch (error) {
    if (error instanceof ShortCircuitError) {
      return undefined;
    }
    throw error;
  }
}
