import { executeNode } from "./executeNode.js";
import { createEnvironmentRecord } from "../runtime/createEnvironmentRecord.js";

export function executeTryStatement(node, executionContextStack, heap) {
  const executionContext = executionContextStack.current();
  const previousEnvironment = executionContext.lexicalEnvironment;
  const previousPendingException = executionContext.pendingException;

  let thrownException = undefined;
  let caught = false;

  executeNode(node.block, executionContextStack, heap);

  if (executionContext.pendingException !== undefined) {
    thrownException = executionContext.pendingException;
    executionContext.pendingException = undefined;
  }

  if (thrownException !== undefined && node.handler) {
    const catchEnvironment = {
      scope: previousEnvironment.scope,
      outer: previousEnvironment,
      environmentRecord: createEnvironmentRecord(),
    };

    executionContext.lexicalEnvironment = catchEnvironment;

    if (node.handler.param) {
      catchEnvironment.environmentRecord.bindings.set(node.handler.param.name, {
        kind: "let",
        value: thrownException,
        initialized: true,
      });
    }

    executeNode(node.handler.body, executionContextStack, heap);
    executionContext.lexicalEnvironment = previousEnvironment;

    caught = true;
  }

  if (node.finalizer) {
    // Stash the control-flow state before running the finalizer
    const stashedIsReturning = executionContext.isReturning;
    const stashedReturnValue = executionContext.returnValue;
    const stashedIsBreaking = executionContext.isBreaking;
    const stashedBreakLabel = executionContext.breakLabel;
    const stashedIsContinuing = executionContext.isContinuing;
    const stashedContinueLabel = executionContext.continueLabel;

    // Reset control-flow state so finalizer executes normally
    executionContext.isReturning = false;
    executionContext.returnValue = undefined;
    executionContext.isBreaking = false;
    executionContext.breakLabel = undefined;
    executionContext.isContinuing = false;
    executionContext.continueLabel = undefined;

    executeNode(node.finalizer, executionContextStack, heap);

    // Restore stashed state only if the finalizer didn't initiate its own control-flow interruption
    if (
      !executionContext.isReturning &&
      !executionContext.isBreaking &&
      !executionContext.isContinuing &&
      executionContext.pendingException === undefined
    ) {
      executionContext.isReturning = stashedIsReturning;
      executionContext.returnValue = stashedReturnValue;
      executionContext.isBreaking = stashedIsBreaking;
      executionContext.breakLabel = stashedBreakLabel;
      executionContext.isContinuing = stashedIsContinuing;
      executionContext.continueLabel = stashedContinueLabel;
    }
  }

  if (!caught && thrownException !== undefined) {
    executionContext.pendingException = thrownException;
  }

  if (caught && executionContext.pendingException !== undefined) {
    // If the handler threw a *new* exception, keep it.
    // Otherwise restore the outer pending exception (if any).
  } else if (caught && executionContext.pendingException === undefined) {
    executionContext.pendingException = previousPendingException;
  }
}
