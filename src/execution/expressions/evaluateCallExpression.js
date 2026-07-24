import { evaluateExpression } from "./evaluateExpression.js";
import { callFunction } from "../../runtime/function/callFunction.js";

export function evaluateCallExpression(node, executionContextStack) {
  const callee = evaluateExpression(node.callee, executionContextStack);

  const args = node.arguments.map((argument) =>
    evaluateExpression(argument, executionContextStack),
  );

  return callFunction(callee, args, executionContextStack);
}
