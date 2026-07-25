import { allocateObject } from "../../runtime/heap/allocateObject.js";
import { createBinding } from "../../runtime/environment/createBinding.js";
import { setBindingValue } from "../../runtime/environment/setBindingValues.js";

function createConsoleMethod(methodName, type, runtime) {
  return {
    isNative: true,
    name: methodName,
    nativeCall(args, executionContextStack, currentHeap) {
      const resolvedArgs = args.map((arg) => {
        if (typeof arg === "number") {
          return currentHeap.get(arg);
        }
        return arg;
      });

      const line = runtime.currentNode?.loc?.start?.line || 1;

      console.log(`🖥️ [Simulated Console ${methodName} (line ${line})]:`, ...resolvedArgs);

      runtime.consoleLogs.push({
        type,
        line,
        args: resolvedArgs,
      });

      const logId = Date.now() + Math.random();
      runtime.webAPIs.set(logId, { type: `console.${methodName}` });

      if (runtime.onStep) {
        runtime.onStep(null, runtime);
      }

      runtime.webAPIs.delete(logId);

      return undefined;
    },
  };
}

export function createConsole(globalExecutionContext, runtime) {
  const { heap } = runtime;
  const consoleObject = {
    log: createConsoleMethod("log", "log", runtime),
    error: createConsoleMethod("error", "error", runtime),
    warn: createConsoleMethod("warn", "warn", runtime),
    info: createConsoleMethod("info", "info", runtime),
  };

  const consoleAddress = allocateObject(heap, consoleObject);

  const consoleBinding = createBinding("console", "const");
  setBindingValue(consoleBinding, consoleAddress);

  globalExecutionContext.lexicalEnvironment.environmentRecord.bindings.set(
    "console",
    consoleBinding,
  );
}
