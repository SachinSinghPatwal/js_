import { createExecutionContext } from "../runtime/context/createExecutionContext.js";
import { resetEcIdCounter } from "../runtime/context/createExecutionContext.js";
import { populateBindings } from "../runtime/createRuntimeBindings.js";
import ExecutionContextStack from "../runtime/callStack/ExecutionContextStack.js";
import Heap from "../runtime/heap/heap.js";
import { allocateObject } from "../runtime/heap/allocateObject.js";
import { createBinding } from "../runtime/environment/createBinding.js";
import { setBindingValue } from "../runtime/environment/setBindingValues.js";

import { createConsole } from "./builtins/createConsole.js";
import { createSetTimeout } from "./builtins/createSetTimeout.js";
import { createPromise } from "./builtins/createPromise.js";

export function initializeRuntime(scopeTree) {
  // Reset EC ID counter for fresh execution
  resetEcIdCounter();

  const heap = new Heap();

  const executionContextStack = new ExecutionContextStack();

  const globalExecutionContext = createExecutionContext("global", scopeTree);

  // Create the global object in the heap
  const globalObjectAddress = allocateObject(heap, {
    type: 'GlobalObject',
    name: 'window',
  }, 'Object');

  // Set the this binding on the Global EC to point to the global object in heap
  globalExecutionContext.thisBinding = globalObjectAddress;

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
    webAPIs: new Map(),
    consoleLogs: [],
    globalObjectAddress,

    // Host environment: 'browser' or 'node'
    hostEnvironment: 'browser',

    // Event loop phase tracking for visualization
    eventLoop: {
      phase: 'IDLE',
      currentPhaseStep: null,
      phases: [
        'CHECK_STACK_EMPTY',
        'DRAIN_MICROTASKS',
        'RENDER_OPPORTUNITY',
        'TAKE_MACROTASK',
        'CREATE_EC',
        'EXECUTE',
      ],
      phasesNode: [
        'CHECK_STACK_EMPTY',
        'DRAIN_NEXTTICK',
        'DRAIN_MICROTASKS',
        'TAKE_MACROTASK',
        'CREATE_EC',
        'EXECUTE',
      ],
    },

    // Closure events for visualization
    closureEvents: [],
  };

  heap.runtime = runtime; // Expose for visualization hooks

  createConsole(globalExecutionContext, runtime);
  createSetTimeout(globalExecutionContext, runtime);
  createPromise(globalExecutionContext, runtime);

  return runtime;
}
