import { evaluateExpression } from "./evaluateExpression.js";
import { callFunction } from "../../runtime/function/callFunction.js";
import { getHeapValue } from "../../runtime/heap/getHeapValue.js";
import { allocateObject } from "../../runtime/heap/allocateObject.js";
import { ShortCircuitError } from "./ShortCircuitError.js";

export function evaluateCallExpression(node, executionContextStack, heap) {
  let fn;
  let receiverAddress;

  // --- super(...args) — constructor chaining ---
  if (node.callee.type === "Super") {
    const executionContext = executionContextStack.current();
    const thisAddress = executionContext.thisBinding;

    // The currently running constructor keeps its superClass reference
    // Walk the execution context stack to find the constructor's superClass
    const superClass = executionContext.superClass;

    if (!superClass || typeof superClass !== "object") {
      throw new TypeError("Must call super constructor in derived class before accessing 'this'");
    }

    const args = evaluateArguments(node.arguments, executionContextStack, heap);

    callFunction(superClass, args, executionContextStack, heap, thisAddress);

    return undefined;
  }

  // --- super.method(...args) — parent prototype method call ---
  if (
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Super"
  ) {
    const executionContext = executionContextStack.current();
    receiverAddress = executionContext.thisBinding;

    // Find the parent prototype to look up the method
    const homeObject = executionContext.homeObject;
    if (!homeObject) {
      throw new ReferenceError("'super' keyword unexpected here");
    }

    const parentPrototype = homeObject.__proto__;
    if (!parentPrototype) {
      throw new TypeError("Cannot read properties of undefined");
    }

    const property = node.callee.computed
      ? evaluateExpression(node.callee.property, executionContextStack, heap)
      : node.callee.property.name;

    fn = parentPrototype[property];

    if (!fn || typeof fn !== "object") {
      throw new TypeError(`super.${property} is not a function`);
    }

    const args = evaluateArguments(node.arguments, executionContextStack, heap);

    return callFunction(fn, args, executionContextStack, heap, receiverAddress);
  }

  if (node.callee.type === "MemberExpression") {
    receiverAddress = evaluateExpression(
      node.callee.object,
      executionContextStack,
      heap,
    );

    const object =
      typeof receiverAddress === "number"
        ? getHeapValue(heap, receiverAddress)
        : receiverAddress;

    const property = node.callee.computed
      ? evaluateExpression(node.callee.property, executionContextStack, heap)
      : node.callee.property.name;

    if (
      node.callee.object.type === "Identifier" &&
      node.callee.object.name === "Object" &&
      property === "create"
    ) {
      const prototypeAddress =
        node.arguments.length > 0
          ? evaluateExpression(node.arguments[0], executionContextStack, heap)
          : undefined;

      const prototype =
        typeof prototypeAddress === "number"
          ? getHeapValue(heap, prototypeAddress)
          : undefined;

      const createdObject = prototype ? { __proto__: prototypeAddress } : {};

      return allocateObject(heap, createdObject);
    }

    let current = object;
    fn = undefined;

    while (current !== null && current !== undefined) {
      if (Object.prototype.hasOwnProperty.call(current, property)) {
        fn = current[property];
        break;
      }
      current =
        typeof current.__proto__ === "number"
          ? getHeapValue(heap, current.__proto__)
          : current.__proto__ ?? null;
    }

    if (fn === undefined) {
      console.error("[evaluateCallExpression] Failed to resolve property:", property, "on object:", object);
    }
  } else {
    fn = evaluateExpression(node.callee, executionContextStack, heap);
  }

  if (node.optional && (fn === null || fn === undefined)) {
    throw new ShortCircuitError();
  }

  const args = evaluateArguments(node.arguments, executionContextStack, heap);

  return callFunction(fn, args, executionContextStack, heap, receiverAddress);
}

// --- Shared argument evaluation helper ---
function evaluateArguments(argumentNodes, executionContextStack, heap) {
  const args = [];

  for (const argument of argumentNodes) {
    if (argument.type === "SpreadElement") {
      const spreadValue = evaluateExpression(
        argument.argument,
        executionContextStack,
        heap,
      );

      const resolvedSpread =
        typeof spreadValue === "number" ? getHeapValue(heap, spreadValue) : spreadValue;

      if (Array.isArray(resolvedSpread)) {
        args.push(...resolvedSpread);
        continue;
      }

      if (resolvedSpread !== null && resolvedSpread !== undefined) {
        args.push(...Array.from(resolvedSpread));
        continue;
      }

      continue;
    }

    args.push(evaluateExpression(argument, executionContextStack, heap));
  }

  return args;
}
