import { createExecutionContext } from "../runtime/createExecutionContext.js";
import { populateBindings } from "../memory/createRuntimeBindings.js";
import ExecutionContextStack from "../runtime/callStack/ExecutionContextStack.js";
import Heap from "../runtime/heap/heap.js";
import { allocateObject } from "../runtime/heap/allocateObject.js";
import { createBinding } from "../runtime/createBinding.js";
import { setBindingValue } from "../runtime/setBindingValues.js";

import { createConsole } from "./builtins/createConsole.js";
import { createSetTimeout } from "./builtins/createSetTimeout.js";
import { createPromise } from "./builtins/createPromise.js";

export function initializeRuntime(scopeTree) {
  const heap = new Heap();

  const executionContextStack = new ExecutionContextStack();

  const globalExecutionContext = createExecutionContext("global", scopeTree);

  executionContextStack.push(globalExecutionContext);

  populateBindings(
    scopeTree,
    globalExecutionContext.lexicalEnvironment.environmentRecord,
    globalExecutionContext.lexicalEnvironment
  );

  const prototypeAddress = allocateObject(heap, {
    constructor: null,
  });

  const objectAddress = allocateObject(heap, {
    prototype: prototypeAddress,
  });

  const objectBinding = createBinding("Object", "const");
  setBindingValue(objectBinding, objectAddress);

  globalExecutionContext.lexicalEnvironment.environmentRecord.bindings.set(
    "Object",
    objectBinding,
  );

  const runtime = {
    executionContextStack,
    globalExecutionContext,
    heap,
    microtaskQueue: [],
    macrotaskQueue: [],
    consoleLogs: [],
  };

  heap.runtime = runtime; // Expose for visualization hooks

  createConsole(globalExecutionContext, runtime);
  createSetTimeout(globalExecutionContext, runtime);
  createPromise(globalExecutionContext, runtime);

  return runtime;
}


