import { evaluateExpression } from "./evaluateExpression.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";

export function evaluateMemberAssignmentExpression(
  node,
  executionContextStack,
  heap,
) {
  const objectAddress = evaluateExpression(
    node.left.object,
    executionContextStack,
    heap,
  );

  const object = getHeapValue(heap, objectAddress);

  const property = node.left.computed
    ? evaluateExpression(node.left.property, executionContextStack, heap)
    : node.left.property.name;

  let lhsValue;
  if (node.operator !== "=") {
    lhsValue = object[property];

    // Short-circuit logical assignments
    if (node.operator === "&&=" && !lhsValue) return lhsValue;
    if (node.operator === "||=" && lhsValue) return lhsValue;
    if (node.operator === "??=" && lhsValue !== null && lhsValue !== undefined) return lhsValue;
  }

  const rhsValue = evaluateExpression(node.right, executionContextStack, heap);

  let finalValue = rhsValue;
  switch (node.operator) {
    case "=": finalValue = rhsValue; break;
    case "+=": finalValue = lhsValue + rhsValue; break;
    case "-=": finalValue = lhsValue - rhsValue; break;
    case "*=": finalValue = lhsValue * rhsValue; break;
    case "/=": finalValue = lhsValue / rhsValue; break;
    case "%=": finalValue = lhsValue % rhsValue; break;
    case "**=": finalValue = lhsValue ** rhsValue; break;
    case "<<=": finalValue = lhsValue << rhsValue; break;
    case ">>=": finalValue = lhsValue >> rhsValue; break;
    case ">>>=": finalValue = lhsValue >>> rhsValue; break;
    case "&=": finalValue = lhsValue & rhsValue; break;
    case "^=": finalValue = lhsValue ^ rhsValue; break;
    case "|=": finalValue = lhsValue | rhsValue; break;
    case "&&=": finalValue = rhsValue; break;
    case "||=": finalValue = rhsValue; break;
    case "??=": finalValue = rhsValue; break;
  }

  object[property] = finalValue;
  return finalValue;
}
