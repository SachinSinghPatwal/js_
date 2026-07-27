export function useExecutionStageInfo(currentSnapshot, snapshots) {
  const currentNode = currentSnapshot?.currentNode;
  const eventLoop = currentSnapshot?.eventLoopPhase;
  const callStack = currentSnapshot?.runtime?.executionContextStack?.stack || [];
  const topFrame = callStack[callStack.length - 1];
  const microtasks = currentSnapshot?.runtime?.microtaskQueue || [];
  const macrotasks = currentSnapshot?.runtime?.macrotaskQueue || [];

  const isExecutionActive = currentSnapshot !== null && snapshots.length > 0;

  const bindingsMap = topFrame?.lexicalEnvironment?.environmentRecord?.bindings;
  const activeBindings = bindingsMap ? Array.from(bindingsMap.entries()) : [];

  const getConciseStepInfo = () => {
    if (!currentSnapshot) {
      return {
        summary: "Ready to execute code",
        badge: "Idle",
        position: "Idle",
        details: {
          concept: "Runtime Initialization",
          description: "JavaScript code runs inside V8 engine. Click Play or Step to execute.",
          location: "Not yet loaded in stack or heap",
        },
      };
    }

    const phase = eventLoop?.phase;

    if (phase === "EXECUTING_SYNC") {
      if (currentNode?.type === "VariableDeclaration") {
        const decl = currentNode.declarations?.[0];
        const idName = decl?.id?.name || "variable";
        return {
          summary: `Declaring binding '${idName}' in ${topFrame?.scope?.name || "Global"} scope`,
          badge: "Sync Exec",
          position: "Source.js ➔ Call Stack ➔ Lexical Environment",
          details: {
            concept: "Lexical Binding & Memory Allocation",
            description: `V8 binds identifier '${idName}' in the active Execution Context's Lexical Environment.`,
            location: `Call Stack (Frame: ${topFrame?.scope?.name || "Global"})`,
          },
        };
      }

      if (currentNode?.type === "FunctionDeclaration") {
        const fnName = currentNode.id?.name || "function";
        return {
          summary: `Creating FunctionObject for '${fnName}' in Memory Heap`,
          badge: "Heap Alloc",
          position: "Call Stack ➔ Memory Heap (FunctionObject)",
          details: {
            concept: "First-Class Function Instantiation",
            description: `V8 creates a Function object stored in Heap memory with [[Environment]] closure reference.`,
            location: "Memory Heap (Address 0x000X)",
          },
        };
      }

      if (currentNode?.type === "CallExpression") {
        const calleeName =
          currentNode.callee?.name ||
          currentNode.callee?.property?.name ||
          "function";
        return {
          summary: `Pushing Function Execution Context for ${calleeName}()`,
          badge: "Stack Push",
          position: "Source.js ➔ Call Stack (Push Frame)",
          details: {
            concept: "Execution Context Stack Push",
            description: `V8 pushes a new Function Execution Context onto Call Stack and binds parameters & 'this'.`,
            location: `Call Stack (Active Top Frame: ${calleeName}())`,
          },
        };
      }

      return {
        summary: `Executing ${currentNode?.type || "Statement"} at Line ${currentNode?.loc?.start?.line || 1}`,
        badge: "Sync Exec",
        position: "Call Stack (Bytecode Execution)",
        details: {
          concept: "V8 Bytecode Execution",
          description: `V8 Ignition interpreter executing AST node at line ${currentNode?.loc?.start?.line || 1}.`,
          location: `Call Stack (Frame: ${topFrame?.scope?.name || "Global"})`,
        },
      };
    }

    if (phase === "DRAIN_MICROTASKS") {
      return {
        summary: `Processing Microtask Job (${microtasks.length} remaining)`,
        badge: "Microtask",
        position: "Microtask Queue ➔ Call Stack",
        details: {
          concept: "PromiseReactionJob Draining",
          description: "Microtasks (Promise reactions) are dequeued and executed with top priority before rendering.",
          location: "Microtask Queue ➔ Call Stack",
        },
      };
    }

    if (phase === "TAKE_MACROTASK") {
      return {
        summary: `Dequeuing 1 Macrotask (${macrotasks.length} remaining)`,
        badge: "Macrotask",
        position: "Macrotask Queue ➔ Call Stack",
        details: {
          concept: "Event Loop Macrotask Dequeue",
          description: "The Event Loop pulls 1 macrotask (timer/event callback) into Call Stack for execution.",
          location: "Macrotask Queue ➔ Call Stack",
        },
      };
    }

    return {
      summary: "All execution completed & queues empty",
      badge: "Idle",
      position: "Idle",
      details: {
        concept: "Execution Finish",
        description: "Call Stack is empty, Microtask Queue is empty, Macrotask Queue is empty.",
        location: "Idle",
      },
    };
  };

  return {
    isExecutionActive,
    info: getConciseStepInfo(),
    currentNode,
    activeBindings,
    callStack,
    microtasks,
    macrotasks,
  };
}
