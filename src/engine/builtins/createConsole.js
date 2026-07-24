import { allocateObject } from "../../runtime/heap/allocateObject.js";
import { createBinding } from "../../runtime/createBinding.js";
import { setBindingValue } from "../../runtime/setBindingValues.js";

export function createConsole(globalExecutionContext, runtime) {
  const { heap } = runtime;
  const consoleObject = {
    log: {
      isNative: true,
      name: "log",
      // eslint-disable-next-line no-unused-vars
      nativeCall(args, executionContextStack, currentHeap) {
        // Resolve arguments by fetching from heap if they are addresses
        const resolvedArgs = args.map((arg) => {
          if (typeof arg === "number") {
            return currentHeap.get(arg);
          }
          return arg;
        });

        // Still log to actual console for debugging
        console.log("🖥️ [Simulated Console]:", ...resolvedArgs);
        
        // Push to the simulated console queue
        runtime.consoleLogs.push({
          type: 'log',
          args: resolvedArgs
        });
        
        return undefined;
      },
    },
  };

  const consoleAddress = allocateObject(heap, consoleObject);

  const consoleBinding = createBinding("console", "const");
  setBindingValue(consoleBinding, consoleAddress);

  globalExecutionContext.lexicalEnvironment.environmentRecord.bindings.set(
    "console",
    consoleBinding,
  );
}
