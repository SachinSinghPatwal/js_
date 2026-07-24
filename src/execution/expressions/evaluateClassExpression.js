import { FunctionObject } from "../../memory/FunctionObject.js";
import { evaluateExpression } from "./evaluateExpression.js";
import { callFunction } from "../../runtime/function/callFunction.js";

export function evaluateClassExpression(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();
  const scope = executionContext.lexicalEnvironment;

  const superClassValue = node.superClass
    ? evaluateExpression(node.superClass, executionContextStack, heap)
    : undefined;

  const prototype = {
    constructor: null,
  };

  if (
    superClassValue &&
    typeof superClassValue === "object" &&
    superClassValue.prototype
  ) {
    prototype.__proto__ = superClassValue.prototype;
  }

  const constructorMethod = (node.body.body ?? []).find(
    (member) =>
      member.type === "MethodDefinition" && member.kind === "constructor",
  );

  const classConstructor = new FunctionObject(
    {
      id: node.id,
      params: constructorMethod?.value?.params ?? [],
      body: constructorMethod?.value?.body ?? {
        type: "BlockStatement",
        body: [],
      },
    },
    scope,
    { superClass: superClassValue },
  );

  classConstructor.name = node.id?.name ?? null;
  classConstructor.prototype = prototype;
  prototype.constructor = classConstructor;

  // Collect instance field definitions for later application during `new`
  const instanceFieldDefinitions = [];

  for (const member of node.body.body ?? []) {
    // --- MethodDefinition ---
    if (member.type === "MethodDefinition") {
      if (member.kind === "constructor") {
        continue;
      }

      const keyName =
        member.key.type === "Identifier"
          ? member.key.name
          : member.key.value;

      const target = member.static ? classConstructor : prototype;

      if (member.kind === "get" || member.kind === "set") {
        const methodFn = new FunctionObject(
          {
            id: null,
            params: member.value.params,
            body: member.value.body,
          },
          scope,
          { homeObject: target },
        );

        const existing = Object.getOwnPropertyDescriptor(target, keyName) || {
          enumerable: true,
          configurable: true,
        };

        existing[member.kind] = function (...args) {
          const thisAddress = Array.from(heap.memory.entries()).find(
            (entry) => entry[1] === this,
          )?.[0];
          return callFunction(methodFn, args, executionContextStack, heap, thisAddress);
        };

        Object.defineProperty(target, keyName, existing);
        continue;
      }

      const methodFn = new FunctionObject(
        {
          id: null,
          params: member.value.params,
          body: member.value.body,
        },
        scope,
        { homeObject: target },
      );

      target[keyName] = methodFn;

      continue;
    }

    // --- PropertyDefinition (fields) ---
    if (member.type === "PropertyDefinition") {
      const keyName =
        member.key.type === "Identifier"
          ? member.key.name
          : member.key.value;

      if (member.static) {
        // Static field → evaluate immediately and set on constructor
        const value = member.value
          ? evaluateExpression(member.value, executionContextStack, heap)
          : undefined;

        classConstructor[keyName] = value;
      } else {
        // Instance field → collect for application during `new`
        instanceFieldDefinitions.push({
          key: keyName,
          valueNode: member.value,
        });
      }

      continue;
    }
  }

  // Store instance field definitions on the constructor for NewExpression
  if (instanceFieldDefinitions.length > 0) {
    classConstructor.instanceFieldDefinitions = instanceFieldDefinitions;
  }

  return classConstructor;
}
