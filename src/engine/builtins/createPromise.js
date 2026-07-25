import { allocateObject } from "../../runtime/heap/allocateObject.js";
import { createBinding } from "../../runtime/createBinding.js";
import { setBindingValue } from "../../runtime/setBindingValues.js";
import { callFunction } from "../../runtime/function/callFunction.js";

export function createPromise(globalExecutionContext, runtime) {
  const { heap, microtaskQueue, executionContextStack } = runtime;

  // Promise.prototype
  const promisePrototypeObj = {
    then: {
      isNative: true,
      name: "then",
      nativeCall(args, _, __, thisAddress) {
        const onFulfilledArg = args[0];
        const onFulfilled = typeof onFulfilledArg === "number" ? heap.get(onFulfilledArg) : onFulfilledArg;
        
        const onRejectedArg = args[1];
        const onRejected = typeof onRejectedArg === "number" ? heap.get(onRejectedArg) : onRejectedArg;

        const promiseObj = heap.get(thisAddress);

        if (!promiseObj || promiseObj.PromiseState === undefined) {
          throw new TypeError("Method Promise.prototype.then called on incompatible receiver");
        }

        // To support chaining, .then() returns a new Promise.
        // We simulate this by creating a new promise object internally.
        const chainedPromiseObj = {
          PromiseState: "pending",
          PromiseResult: undefined,
          PromiseFulfillReactions: [],
          PromiseRejectReactions: [],
        };
        Object.defineProperty(chainedPromiseObj, "__proto__", { value: promisePrototypeAddress, writable: true });
        const chainedPromiseAddress = allocateObject(heap, chainedPromiseObj);

        const chainedResolve = {
          isNative: true,
          nativeCall(resArgs) {
            if (chainedPromiseObj.PromiseState !== "pending") return;
            chainedPromiseObj.PromiseState = "fulfilled";
            chainedPromiseObj.PromiseResult = resArgs[0];
            for (const rx of chainedPromiseObj.PromiseFulfillReactions) {
              microtaskQueue.push(rx);
            }
          },
        };

        const chainedReject = {
          isNative: true,
          nativeCall(rejArgs) {
            if (chainedPromiseObj.PromiseState !== "pending") return;
            chainedPromiseObj.PromiseState = "rejected";
            chainedPromiseObj.PromiseResult = rejArgs[0];
            for (const rx of chainedPromiseObj.PromiseRejectReactions) {
              microtaskQueue.push(rx);
            }
          },
        };

        const createReaction = (handler, defaultResolution) => {
          return {
            type: 'PromiseReaction',
            callback: {
              isNative: true,
              nativeCall() {
                if (!handler || typeof handler !== "object") {
                  // Fallthrough if no handler provided (e.g. .catch() only)
                  if (defaultResolution === "resolve") {
                    callFunction(chainedResolve, [promiseObj.PromiseResult], executionContextStack, heap);
                  } else {
                    callFunction(chainedReject, [promiseObj.PromiseResult], executionContextStack, heap);
                  }
                  return;
                }

                try {
                  const result = callFunction(handler, [promiseObj.PromiseResult], executionContextStack, heap);
                  // Extremely simplified resolution (does not handle returning another Promise)
                  callFunction(chainedResolve, [result], executionContextStack, heap);
                } catch (error) {
                  callFunction(chainedReject, [error], executionContextStack, heap);
                }
              },
            },
            args: [],
            thisValue: undefined,
          };
        };

        const fulfillReaction = createReaction(onFulfilled, "resolve");
        const rejectReaction = createReaction(onRejected, "reject");

        if (promiseObj.PromiseState === "pending") {
          promiseObj.PromiseFulfillReactions.push(fulfillReaction);
          promiseObj.PromiseRejectReactions.push(rejectReaction);
        } else if (promiseObj.PromiseState === "fulfilled") {
          microtaskQueue.push(fulfillReaction);
        } else if (promiseObj.PromiseState === "rejected") {
          microtaskQueue.push(rejectReaction);
        }

        return chainedPromiseAddress;
      },
    },
    catch: {
      isNative: true,
      name: "catch",
      nativeCall(args, _, __, thisAddress) {
        const onRejected = args[0];
        // .catch(fn) is essentially .then(undefined, fn)
        const thenNative = promisePrototypeObj.then;
        return thenNative.nativeCall([undefined, onRejected], executionContextStack, heap, thisAddress);
      },
    },
  };

  const promisePrototypeAddress = allocateObject(heap, promisePrototypeObj);
  promisePrototypeObj.then.nativeCall.__proto__ = null; // Internal safety
  promisePrototypeObj.catch.nativeCall.__proto__ = null;

  // The global Promise constructor
  const promiseNative = {
    isNative: true,
    name: "Promise",
    nativeCall(args, _, __, thisAddress, newTarget) {
      if (!newTarget) {
        throw new TypeError("Promise constructor cannot be invoked without 'new'");
      }

      const executorArg = args[0];
      const executor = typeof executorArg === "number" ? heap.get(executorArg) : executorArg;
      if (!executor || typeof executor !== "object") {
        throw new TypeError("Promise resolver is not a function");
      }

      const promiseObj = {
        PromiseState: "pending",
        PromiseResult: undefined,
        PromiseFulfillReactions: [],
        PromiseRejectReactions: [],
      };
      Object.defineProperty(promiseObj, "__proto__", { value: promisePrototypeAddress, writable: true });

      const promiseAddress = allocateObject(heap, promiseObj);

      const resolveNative = {
        isNative: true,
        nativeCall(resArgs) {
          if (promiseObj.PromiseState !== "pending") return;
          promiseObj.PromiseState = "fulfilled";
          promiseObj.PromiseResult = resArgs[0];

          for (const rx of promiseObj.PromiseFulfillReactions) {
            microtaskQueue.push(rx);
          }
        },
      };

      const rejectNative = {
        isNative: true,
        nativeCall(rejArgs) {
          if (promiseObj.PromiseState !== "pending") return;
          promiseObj.PromiseState = "rejected";
          promiseObj.PromiseResult = rejArgs[0];

          for (const rx of promiseObj.PromiseRejectReactions) {
            microtaskQueue.push(rx);
          }
        },
      };

      try {
        callFunction(executor, [resolveNative, rejectNative], executionContextStack, heap);
      } catch (error) {
        callFunction(rejectNative, [error], executionContextStack, heap);
      }

      return promiseAddress;
    },
  };

  // Add Promise.resolve
  promiseNative.resolve = {
    isNative: true,
    name: "resolve",
    nativeCall(args) {
      const promiseObj = {
        PromiseState: "fulfilled",
        PromiseResult: args[0],
        PromiseFulfillReactions: [],
        PromiseRejectReactions: [],
      };
      Object.defineProperty(promiseObj, "__proto__", { value: promisePrototypeAddress, writable: true });
      return allocateObject(heap, promiseObj);
    },
  };

  // Add Promise.reject
  promiseNative.reject = {
    isNative: true,
    name: "reject",
    nativeCall(args) {
      const promiseObj = {
        PromiseState: "rejected",
        PromiseResult: args[0],
        PromiseFulfillReactions: [],
        PromiseRejectReactions: [],
      };
      Object.defineProperty(promiseObj, "__proto__", { value: promisePrototypeAddress, writable: true });
      return allocateObject(heap, promiseObj);
    },
  };

  promiseNative.prototype = promisePrototypeAddress;
  promisePrototypeObj.constructor = promiseNative;

  const promiseBinding = createBinding("Promise", "const");
  setBindingValue(promiseBinding, promiseNative);

  globalExecutionContext.lexicalEnvironment.environmentRecord.bindings.set(
    "Promise",
    promiseBinding,
  );
}
