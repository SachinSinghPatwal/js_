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

  const getStepExplanation = () => {
    if (!currentSnapshot) {
      return {
        title: "Ready to Execute",
        action: "Press Play or Step Forward to run code",
        details:
          "The visualizer steps through code line by line, demonstrating AST node execution, context creation, memory allocation, and event loop job dispatching.",
        badge: "Idle",
      };
    }

    const phase = eventLoop?.phase;

    if (phase === "EXECUTING_SYNC") {
      if (currentNode?.type === "VariableDeclaration") {
        const decl = currentNode.declarations?.[0];
        const idName = decl?.id?.name || "variable";
        return {
          title: `Variable Binding: '${idName}'`,
          action: `Declaring binding '${idName}' in ${topFrame?.scope?.name || "Global"} Lexical Environment`,
          details:
            "Memory allocated in active Lexical Environment Record. If let/const, binding remains uninitialized in TDZ until evaluated.",
          badge: "Sync Exec",
        };
      }

      if (currentNode?.type === "FunctionDeclaration") {
        const fnName = currentNode.id?.name || "function";
        return {
          title: `Function Instantiation: '${fnName}'`,
          action: `Creating FunctionObject for '${fnName}' with [[Environment]] pointer`,
          details:
            "First-class function object created in Heap with hidden [[Environment]] reference to declaration scope.",
          badge: "Heap Alloc",
        };
      }

      if (currentNode?.type === "CallExpression") {
        const calleeName =
          currentNode.callee?.name ||
          currentNode.callee?.property?.name ||
          "function";
        return {
          title: `Function Call: ${calleeName}()`,
          action: `Evaluating CallExpression '${calleeName}' & creating Execution Context`,
          details:
            "New Function Execution Context pushed onto Call Stack with parameter bindings and 'this' reference.",
          badge: "Stack Push",
        };
      }

      return {
        title: `Executing Node: ${currentNode?.type || "Statement"}`,
        action: `Bytecode interpreter executing statement at line ${currentNode?.loc?.start?.line || 1}`,
        details:
          "AST compiled to bytecode by V8 engine (Ignition). Executes instructions modifying runtime state.",
        badge: "Sync Exec",
      };
    }

    if (phase === "CHECK_STACK_EMPTY") {
      return {
        title: "Event Loop: Stack Check",
        action: "Verifying Call Stack is empty before processing queues",
        details:
          "The Event Loop never interrupts synchronous code. Queues drain ONLY when Call Stack is zero.",
        badge: "Event Loop",
      };
    }

    if (phase === "DRAIN_MICROTASKS") {
      return {
        title: "Event Loop: Draining Microtasks",
        action: eventLoop?.currentPhaseStep || "Executing queued Promise reactions",
        details:
          "Microtasks (PromiseReactionJobs) run with top priority until queue is completely empty.",
        badge: "Microtasks",
      };
    }

    if (phase === "RENDER_OPPORTUNITY") {
      return {
        title: "Browser Host: Render Window",
        action: "Checking browser repaint opportunity",
        details:
          "DOM layout, recalculate style, and paint occur after microtasks and before macrotasks.",
        badge: "Browser Host",
      };
    }

    if (phase === "TAKE_MACROTASK") {
      return {
        title: "Event Loop: Dequeuing Macrotask",
        action: eventLoop?.currentPhaseStep || "Dequeuing 1 Macrotask from Host queue",
        details:
          "Event Loop processes exactly ONE macrotask per cycle, then immediately drains microtasks.",
        badge: "Macrotask",
      };
    }

    if (phase === "CREATE_EC" || phase === "EXECUTE") {
      return {
        title: "Async Callback Context Created",
        action: eventLoop?.currentPhaseStep || "Spawning new Execution Context for async callback",
        details:
          "Async callbacks spawn a fresh Function Execution Context pointing to [[Environment]].",
        badge: "Context Spawn",
      };
    }

    return {
      title: "Execution Complete",
      action: "All synchronous code and async queues have drained",
      details:
        "Runtime is idle. Call Stack is empty, Microtask Queue is empty, Macrotask Queue is empty.",
      badge: "Idle",
    };
  };

  const exp = getStepExplanation();

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e] p-2.5 overflow-y-auto custom-scrollbar font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#2d2d2d]">
        <span className="text-[11px] text-[#e2b714] uppercase tracking-wider font-semibold">
          Execution Stage
        </span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-[#858585]">
            Step {currentStep} / {Math.max(0, snapshots.length - 1)}
          </span>
          <span className="px-1.5 py-0.5 rounded border border-[#2d2d2d] bg-[#252526] text-[#e2b714] text-[9px] font-bold">
            {exp.badge}
          </span>
        </div>
      </div>

      {/* Main Action Details Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="mt-2 p-2.5 rounded border border-[#2d2d2d] bg-[#252526] flex flex-col gap-1.5"
        >
          <div className="flex items-start justify-between">
            <h3 className="text-xs font-semibold text-[#e2b714]">
              {exp.title}
            </h3>
            {currentNode?.loc && (
              <span className="text-[9px] bg-[#1e1e1e] border border-[#2d2d2d] text-[#d4d4d4] px-1 rounded">
                Line {currentNode.loc.start.line}:{currentNode.loc.start.column}
              </span>
            )}
          </div>

          <p className="text-[11px] text-[#d4d4d4] bg-[#1e1e1e] p-2 rounded border border-[#2d2d2d]">
            {exp.action}
          </p>

          <p className="text-[10px] text-[#858585] pt-0.5">
            {exp.details}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Minimal Flow Pipeline */}
      <div className="mt-2 flex-1 flex flex-col gap-1">
        <span className="text-[9px] text-[#858585] uppercase tracking-wider font-medium">
          Runtime Pipeline
        </span>

        <div className="grid grid-cols-3 gap-1.5 flex-1 min-h-[70px]">
          <div className="rounded border border-[#2d2d2d] bg-[#252526] p-2 flex flex-col justify-between">
            <span className="text-[9px] text-[#858585] uppercase font-medium">1. AST Node</span>
            <span className="text-[10px] text-[#d4d4d4] truncate font-medium">
              {currentNode ? `<${currentNode.type}>` : "Waiting"}
            </span>
          </div>

          <div className="rounded border border-[#2d2d2d] bg-[#252526] p-2 flex flex-col justify-between">
            <span className="text-[9px] text-[#858585] uppercase font-medium">2. Call Stack</span>
            <span className="text-[10px] text-[#e2b714] truncate font-medium">
              {topFrame ? `${topFrame.scope?.name || topFrame.type}()` : "Empty"}
            </span>
          </div>

          <div className="rounded border border-[#2d2d2d] bg-[#252526] p-2 flex flex-col justify-between">
            <span className="text-[9px] text-[#858585] uppercase font-medium">3. Queues</span>
            <span className="text-[10px] text-[#d4d4d4] truncate font-medium">
              {currentSnapshot?.runtime?.microtaskQueue?.length || 0} Micro | {currentSnapshot?.runtime?.macrotaskQueue?.length || 0} Macro
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
