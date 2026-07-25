import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function ExecutionStagePanel() {
  const { currentSnapshot, currentStep, snapshots } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

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

  const info = getConciseStepInfo();

  const handleKnowMore = (e) => {
    e.stopPropagation();

    // Safely format bindings without circular object references
    const safeBindings = activeBindings.map(([k, v]) => ({
      name: String(k),
      initialized: Boolean(v?.initialized),
      value: typeof v?.value === "object" && v?.value !== null 
        ? `[${v.value.type || "Object"}]` 
        : String(v?.value),
    }));

    VisualizationStore.setModalData({
      type: "V8 Internal Property Inspector",
      title: info.summary,
      data: {
        concept: info.details.concept,
        description: info.details.description,
        currentLocation: info.position,
        activeNodeType: currentNode?.type || "Statement",
        line: currentNode?.loc?.start?.line || 1,
        activeBindings: safeBindings,
        stackDepth: callStack.length,
        microtaskCount: microtasks.length,
        macrotaskCount: macrotasks.length,
      },
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] p-3 font-mono">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2d2d2d] shrink-0">
        <span className="text-[11px] text-[#e2b714] uppercase tracking-wider font-semibold">
          Execution Stage
        </span>
        <div className="flex items-center gap-2 text-[10px]">
          {isExecutionActive ? (
            <>
              <span className="text-[#858585]">
                Step {currentStep} / {Math.max(0, snapshots.length - 1)}
              </span>
              <span className="px-1.5 py-0.5 rounded border border-[#2d2d2d] bg-[#252526] text-[#e2b714] text-[9px] font-bold">
                {info.badge}
              </span>
            </>
          ) : (
            <span className="px-1.5 py-0.5 rounded border border-[#2d2d2d] bg-[#252526] text-[#858585] text-[9px]">
              Idle
            </span>
          )}
        </div>
      </div>

      {/* Centered Abstracted Knowledge & Flow Content */}
      {!isExecutionActive ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <span className="text-[12px] font-semibold text-[#858585] mb-1">
            Execution Stage Idle
          </span>
          <span className="text-[10px] text-[#646669] max-w-[240px]">
            Press Play or Step Forward in timeline controls to start visualization.
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-2 gap-3 max-w-[440px] mx-auto">
          {/* Abstracted Flow Badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`flow-${currentStep}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="px-3 py-1 rounded-full bg-[#252526] border border-[#3c3e41] text-[#e2b714] text-[10px] font-semibold shadow-md"
            >
              {info.position}
            </motion.div>
          </AnimatePresence>

          {/* Concise Abstracted Summary */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`summary-${currentStep}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-1"
            >
              <h3 className="text-sm font-semibold text-[#d4d4d4] leading-snug">
                {info.summary}
              </h3>
              {currentNode?.loc && (
                <span className="text-[9px] text-[#858585]">
                  Line {currentNode.loc.start.line}:{currentNode.loc.start.column} • {currentNode.type}
                </span>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Centered Know More Button */}
          <button
            onClick={handleKnowMore}
            className="mt-1 px-3.5 py-1.5 rounded-lg bg-[#252526] border border-[#3c3e41] text-[#e2b714] hover:bg-[#333333] hover:border-[#e2b714] transition-all text-[10px] font-bold shadow-md flex items-center gap-1 cursor-pointer"
          >
            Know More
          </button>
        </div>
      )}
    </div>
  );
}
