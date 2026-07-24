import { resolveIdentifier } from "../resolveIdentifier.js";
import { setBindingValue } from "../setBindingValues.js";
import { evaluateExpression } from "../../execution/expressions/evaluateExpression.js";
import { getHeapValue } from "../heap/getHeapValue.js";

/**
 * Recursively bind a destructuring pattern (ObjectPattern or ArrayPattern)
 * to a runtime value.
 *
 * @param {object} pattern - The AST pattern node
 * @param {*} value - The runtime value to destructure
 * @param {object} lexicalEnvironment - The current lexical environment
 * @param {object} executionContextStack - The execution context stack
 * @param {object} heap - The heap
 */
export function bindDestructuring(
  pattern,
  value,
  lexicalEnvironment,
  executionContextStack,
  heap,
) {
  if (pattern.type === "ObjectPattern") {
    bindObjectPattern(pattern, value, lexicalEnvironment, executionContextStack, heap);
    return;
  }

  if (pattern.type === "ArrayPattern") {
    bindArrayPattern(pattern, value, lexicalEnvironment, executionContextStack, heap);
    return;
  }

  throw new Error(`Unsupported destructuring pattern: ${pattern.type}`);
}

// --- Object destructuring: const { a, b: c, d = 10 } = obj ---
function bindObjectPattern(
  pattern,
  value,
  lexicalEnvironment,
  executionContextStack,
  heap,
) {
  // Resolve heap address if needed
  const resolved =
    typeof value === "number" ? getHeapValue(heap, value) : value;

  if (resolved === null || resolved === undefined) {
    throw new TypeError("Cannot destructure 'undefined' or 'null'");
  }

  for (const property of pattern.properties) {
    // Rest element: const { a, ...rest } = obj
    if (property.type === "RestElement") {
      const remainingKeys = pattern.properties
        .filter((p) => p.type !== "RestElement")
        .map((p) =>
          p.key.type === "Identifier" ? p.key.name : p.key.value,
        );

      const restObj = {};

      for (const key of Object.keys(resolved)) {
        if (!remainingKeys.includes(key)) {
          restObj[key] = resolved[key];
        }
      }

      bindTarget(
        property.argument,
        restObj,
        lexicalEnvironment,
        executionContextStack,
        heap,
      );

      continue;
    }

    // Compute the source key
    const sourceKey = property.computed
      ? evaluateExpression(property.key, executionContextStack, heap)
      : property.key.type === "Identifier"
        ? property.key.name
        : property.key.value;

    let extractedValue = resolved[sourceKey];

    // Handle default value: { a = 10 } or { a: b = 10 }
    const targetNode = property.value;

    if (targetNode.type === "AssignmentPattern") {
      if (extractedValue === undefined) {
        extractedValue = evaluateExpression(
          targetNode.right,
          executionContextStack,
          heap,
        );
      }

      bindTarget(
        targetNode.left,
        extractedValue,
        lexicalEnvironment,
        executionContextStack,
        heap,
      );

      continue;
    }

    // Normal binding or nested pattern
    bindTarget(
      targetNode,
      extractedValue,
      lexicalEnvironment,
      executionContextStack,
      heap,
    );
  }
}

// --- Array destructuring: const [a, b, ...rest] = arr ---
function bindArrayPattern(
  pattern,
  value,
  lexicalEnvironment,
  executionContextStack,
  heap,
) {
  // Resolve heap address if needed
  const resolved =
    typeof value === "number" ? getHeapValue(heap, value) : value;

  if (resolved === null || resolved === undefined) {
    throw new TypeError("Cannot destructure 'undefined' or 'null'");
  }

  const items = Array.isArray(resolved) ? resolved : Array.from(resolved);

  for (let i = 0; i < pattern.elements.length; i++) {
    const element = pattern.elements[i];

    // Elision: const [, , c] = arr
    if (element === null) {
      continue;
    }

    // Rest element: const [a, ...rest] = arr
    if (element.type === "RestElement") {
      const restValue = items.slice(i);

      bindTarget(
        element.argument,
        restValue,
        lexicalEnvironment,
        executionContextStack,
        heap,
      );

      break;
    }

    let extractedValue = items[i];

    // Handle default value: const [a = 10] = arr
    if (element.type === "AssignmentPattern") {
      if (extractedValue === undefined) {
        extractedValue = evaluateExpression(
          element.right,
          executionContextStack,
          heap,
        );
      }

      bindTarget(
        element.left,
        extractedValue,
        lexicalEnvironment,
        executionContextStack,
        heap,
      );

      continue;
    }

    // Normal binding or nested pattern
    bindTarget(
      element,
      extractedValue,
      lexicalEnvironment,
      executionContextStack,
      heap,
    );
  }
}

/**
 * Bind a single target — either an Identifier, or a nested pattern
 * (ObjectPattern / ArrayPattern).
 */
function bindTarget(
  targetNode,
  value,
  lexicalEnvironment,
  executionContextStack,
  heap,
) {
  if (targetNode.type === "Identifier") {
    const binding = resolveIdentifier(targetNode.name, lexicalEnvironment);
    setBindingValue(binding, value);
    return;
  }

  if (
    targetNode.type === "ObjectPattern" ||
    targetNode.type === "ArrayPattern"
  ) {
    bindDestructuring(
      targetNode,
      value,
      lexicalEnvironment,
      executionContextStack,
      heap,
    );
    return;
  }

  throw new Error(`Unsupported destructuring target: ${targetNode.type}`);
}
