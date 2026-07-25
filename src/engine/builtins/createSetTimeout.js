
import { createBinding } from "../../runtime/environment/createBinding.js";
import { setBindingValue } from "../../runtime/environment/setBindingValues.js";

export function createSetTimeout(globalExecutionContext, runtime) {
  const setTimeoutNative = {
    isNative: true,
    name: "setTimeout",
    nativeCall(args) {
      const callbackArg = args[0];
      const callback = typeof callbackArg === "number" ? runtime.heap.get(callbackArg) : callbackArg;

      if (!callback || typeof callback !== "object") {
        throw new TypeError("setTimeout requires a callback function");
      }

      // We extract any additional arguments passed to setTimeout
      // e.g., setTimeout(cb, 1000, arg1, arg2)
      const callbackArgs = args.slice(2);
      const delay = typeof args[1] === "number" ? args[1] : 0;

      // In a real browser, this would wait for 'delay' ms.
      // In our synchronous visualizer simulation, we add to web APIs to show it,
      // take a snapshot, and then immediately push it to the macrotask queue.
      const timerId = Date.now() + Math.random();
      
      runtime.webAPIs.set(timerId, { type: 'Timer', label: 'setTimeout', delay: delay });
      
      if (runtime.onStep) {
        runtime.onStep(null, runtime);
      }

      runtime.macrotaskQueue.push({
        type: 'TimerTask',
        timerId: timerId,
        callback,
        args: callbackArgs,
        thisValue: undefined, // setTimeout callbacks default to global/undefined this
      });

      return 1; // Simulated timer ID
    },
  };

  const setTimeoutBinding = createBinding("setTimeout", "const");
  setBindingValue(setTimeoutBinding, setTimeoutNative);

  globalExecutionContext.lexicalEnvironment.environmentRecord.bindings.set(
    "setTimeout",
    setTimeoutBinding,
  );
}
