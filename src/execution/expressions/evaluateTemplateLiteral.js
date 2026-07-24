import { evaluateExpression } from "./evaluateExpression.js";

export function evaluateTemplateLiteral(node, executionContextStack, heap) {
  let result = "";
  
  // A template literal intertwines quasis (string chunks) and expressions.
  // There is always one more quasi than expression.
  for (let i = 0; i < node.quasis.length; i++) {
    result += node.quasis[i].value.cooked;

    if (i < node.expressions.length) {
      const expressionValue = evaluateExpression(
        node.expressions[i],
        executionContextStack,
        heap,
      );
      
      result += String(expressionValue);
    }
  }

  return result;
}
