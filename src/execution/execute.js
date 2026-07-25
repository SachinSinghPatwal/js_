import { executeNode } from "./executeNode.js";
import { callFunction } from "../runtime/function/callFunction.js";

export function execute(ast, runtime) {
  const { executionContextStack, heap, microtaskQueue, macrotaskQueue } = runtime;

  // 1. Initial synchronous execution (inside Global EC)
  runtime.eventLoop.phase = 'EXECUTING_SYNC';
  if (runtime.onStep) runtime.onStep(null, runtime);

  for (const statement of ast.body) {
    executeNode(statement, executionContextStack, heap);
  }

  // 2. Pop the Global EC after synchronous code completes
  // This accurately models that the global script is done
  runtime.eventLoop.phase = 'SYNC_COMPLETE';
  if (runtime.onStep) runtime.onStep(null, runtime);

  // 3. The Event Loop Driver
  while (microtaskQueue.length > 0 || macrotaskQueue.length > 0) {

    // Phase: Check if call stack is empty
    runtime.eventLoop.phase = 'CHECK_STACK_EMPTY';
    runtime.eventLoop.currentPhaseStep = 'Checking if call stack is empty...';
    if (runtime.onStep) runtime.onStep(null, runtime);

    // Phase: Drain all microtasks
    if (microtaskQueue.length > 0) {
      runtime.eventLoop.phase = 'DRAIN_MICROTASKS';
      runtime.eventLoop.currentPhaseStep = `Processing ${microtaskQueue.length} microtask(s)`;
      if (runtime.onStep) runtime.onStep(null, runtime);

      while (microtaskQueue.length > 0) {
        const job = microtaskQueue.shift();

        // Create new Function EC for the callback (never reuse Global EC)
        runtime.eventLoop.phase = 'CREATE_EC';
        runtime.eventLoop.currentPhaseStep = `Creating EC for ${job.type || 'callback'}`;
        if (runtime.onStep) runtime.onStep(null, runtime);

        runtime.eventLoop.phase = 'EXECUTE';
        runtime.eventLoop.currentPhaseStep = `Executing ${job.type || 'callback'}`;
        callFunction(job.callback, job.args, executionContextStack, heap, job.thisValue);

        if (runtime.onStep) runtime.onStep(null, runtime);
      }
    }

    // Phase: Render Opportunity (Browser mode only)
    if (runtime.hostEnvironment === 'browser') {
      runtime.eventLoop.phase = 'RENDER_OPPORTUNITY';
      runtime.eventLoop.currentPhaseStep = 'Browser render opportunity';
      if (runtime.onStep) runtime.onStep(null, runtime);
    }

    // Phase: Take exactly one macrotask
    if (macrotaskQueue.length > 0) {
      runtime.eventLoop.phase = 'TAKE_MACROTASK';
      runtime.eventLoop.currentPhaseStep = `Dequeuing 1 macrotask (${macrotaskQueue.length} remaining)`;
      if (runtime.onStep) runtime.onStep(null, runtime);

      const task = macrotaskQueue.shift();

      if (task.timerId && runtime.webAPIs) {
        runtime.webAPIs.delete(task.timerId);
        // Snapshot to show WebAPI -> Macrotask transfer
        if (runtime.onStep) runtime.onStep(null, runtime);
      }

      // Create new Function EC for the macrotask callback
      runtime.eventLoop.phase = 'CREATE_EC';
      runtime.eventLoop.currentPhaseStep = `Creating EC for ${task.type || 'callback'}`;
      if (runtime.onStep) runtime.onStep(null, runtime);

      runtime.eventLoop.phase = 'EXECUTE';
      runtime.eventLoop.currentPhaseStep = `Executing ${task.type || 'callback'}`;
      callFunction(task.callback, task.args, executionContextStack, heap, task.thisValue);

      if (runtime.onStep) runtime.onStep(null, runtime);
    }
  }

  // Event loop is done
  runtime.eventLoop.phase = 'IDLE';
  runtime.eventLoop.currentPhaseStep = 'All queues empty';
}
