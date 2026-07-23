import { evaluateExpression } from "./evaluateExpression.js";
import { callFunction } from "../../runtime/function/callFunction.js";

export function evaluateCallExpression(node, executionContext) {
  const callee = evaluateExpression(node.callee, executionContext);

  const args = node.arguments.map((argument) =>
    evaluateExpression(argument, executionContext),
  );

  return callFunction(callee, args, executionContext);
}
