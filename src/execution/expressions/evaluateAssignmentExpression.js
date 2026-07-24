import { evaluateExpression } from "./evaluateExpression.js";
import { resolveIdentifier } from "../../runtime/resolveIdentifier.js";
import { setBindingValue } from "../../runtime/setBindingValues.js";
import { evaluateMemberAssignmentExpression } from "./evaluateMemberAssignmentExpression.js";
import { bindDestructuring } from "../../runtime/function/bindDestructuring.js";
import { getBindingValue } from "../../runtime/getBindingValues.js";

export function evaluateAssignmentExpression(
  node,
  executionContextStack,
  heap,
) {
  if (node.left.type === "Identifier") {
    const executionContext = executionContextStack.current();
    const binding = resolveIdentifier(
      node.left.name,
      executionContext.lexicalEnvironment,
    );

    let lhsValue;
    if (node.operator !== "=") {
      lhsValue = getBindingValue(binding);

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

    setBindingValue(binding, finalValue);
    return finalValue;
  }

  if (node.left.type === "MemberExpression") {
    return evaluateMemberAssignmentExpression(
      node,
      executionContextStack,
      heap,
    );
  }

  if (
    node.left.type === "ObjectPattern" ||
    node.left.type === "ArrayPattern"
  ) {
    if (node.operator !== "=") {
      throw new SyntaxError("Invalid destructuring assignment target");
    }

    const executionContext = executionContextStack.current();
    const value = evaluateExpression(node.right, executionContextStack, heap);

    bindDestructuring(
      node.left,
      value,
      executionContext.lexicalEnvironment,
      executionContextStack,
      heap,
    );

    return value;
  }

  throw new Error("Unsupported assignment target.");
}
