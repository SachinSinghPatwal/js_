import { executeNode } from "./executeNode.js";
import { callFunction } from "../runtime/function/callFunction.js";

export function execute(ast, runtime) {
  const { executionContextStack, heap, microtaskQueue, macrotaskQueue } = runtime;

  // 1. Initial synchronous execution
  for (const statement of ast.body) {
    executeNode(statement, executionContextStack, heap);
  }

  // 2. The Event Loop Driver
  while (microtaskQueue.length > 0 || macrotaskQueue.length > 0) {
    // Drain the microtask queue completely
    while (microtaskQueue.length > 0) {
      const job = microtaskQueue.shift();
      callFunction(job.callback, job.args, executionContextStack, heap, job.thisValue);
    }

    // Process exactly one macrotask if available
    if (macrotaskQueue.length > 0) {
      const task = macrotaskQueue.shift();
      
      if (task.timerId && runtime.webAPIs) {
        runtime.webAPIs.delete(task.timerId);
        // Force a snapshot to show WebAPI -> Macrotask transfer visually
        if (runtime.onStep) runtime.onStep(null, runtime);
      }
      
      callFunction(task.callback, task.args, executionContextStack, heap, task.thisValue);
    }
  }
}
