
import { createBinding } from "../../runtime/createBinding.js";
import { setBindingValue } from "../../runtime/setBindingValues.js";

export function createSetTimeout(globalExecutionContext, runtime) {
  const setTimeoutNative = {
    isNative: true,
    name: "setTimeout",
    nativeCall(args) {
      const callback = args[0];

      if (!callback || typeof callback !== "object") {
        throw new TypeError("setTimeout requires a callback function");
      }

      // We extract any additional arguments passed to setTimeout
      // e.g., setTimeout(cb, 1000, arg1, arg2)
      const callbackArgs = args.slice(2);

      // In a real browser, this would wait for 'delay' ms.
      // In our synchronous visualizer simulation, we instantly push it to the macrotask queue.
      // If we wanted to accurately simulate time, we could add a `timeoutAt` field
      // and only drain it when the visualizer's global "clock" reaches that time.
      runtime.macrotaskQueue.push({
        type: 'Timeout',
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
