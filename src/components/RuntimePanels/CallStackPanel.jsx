import { useSyncExternalStore, useState } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Cpu, ArrowRight } from "lucide-react";

function BindingsList({ bindings }) {
  if (!bindings || bindings.size === 0) {
    return (
      <span className="text-neutral-600 italic text-[10px]">No bindings</span>
    );
  }

  const entries = Array.from(bindings.entries());

  return (
    <div className="flex flex-col gap-0.5">
      {entries.map(([name, binding]) => {
        const isRef = typeof binding?.value === "number";
        const isObj =
          typeof binding?.value === "object" && binding?.value !== null;
        const displayVal = isRef
          ? `→ 0x${binding.value.toString(16).padStart(4, "0")}`
          : isObj
            ? `[${binding.value?.type || "Object"}]`
            : String(binding?.value);

        return (
          <div key={name} className="flex items-center gap-1.5">
            <span className="text-amber-400 text-[10px] font-semibold">
              {name}
            </span>
            <span className="text-neutral-600 text-[10px]">:</span>
            <span
              className={`text-[10px] ${isRef ? "text-cyan-400" : "text-neutral-300"}`}
            >
              {displayVal}
            </span>
            {!binding?.initialized && (
              <span className="text-[8px] text-red-400 bg-red-950/50 px-1 rounded">
                TDZ
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExecutionContextCard({ frame, index, isTop, isGEC, totalFrames }) {
  const [expanded, setExpanded] = useState(isTop);
  const frameName = frame.scope?.name || frame.type || "anonymous";

  const lexEnv = frame.lexicalEnvironment;
  const varEnv = frame.variableEnvironment;
  const thisBinding = frame.thisBinding;
  const outerRef = frame.outerReference || lexEnv?.outer;

  // Format this binding display
  const thisDisplay =
    thisBinding === undefined || thisBinding === null
      ? "undefined"
      : typeof thisBinding === "number"
        ? `→ 0x${thisBinding.toString(16).padStart(4, "0")}`
        : String(thisBinding);

  // Format outer reference display
  const outerDisplay = outerRef
    ? outerRef.scope?.name || "Outer Environment"
    : "null (Global)";

  return (
    <motion.div
      key={frame.id || index}
      layout
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`rounded-lg border-2 relative overflow-hidden ${
        isTop
          ? "border-amber-500/70 bg-gradient-to-r from-amber-950/40 to-amber-900/20"
          : "border-amber-900/40 bg-amber-950/20"
      } transition-all`}
    >
      {/* Header — always visible */}
      <div
        className="flex items-center justify-between px-3 py-1.5 cursor-pointer hover:bg-amber-900/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown size={12} className="text-amber-500/70" />
          ) : (
            <ChevronRight size={12} className="text-amber-500/70" />
          )}
          <Cpu size={12} className="text-amber-500/50" />
          <span
            className={`text-[11px] font-mono font-semibold ${isTop ? "text-amber-300" : "text-amber-500/70"}`}
          >
            {isGEC ? "Global Execution Context" : `${frameName}()`}
          </span>
        </div>

        <div className="flex gap-1.5 items-center">
          <span className="text-[9px] font-mono bg-amber-900/30 text-amber-500/80 px-1.5 py-0.5 rounded">
            {frame.type === "global" ? "GEC" : "FEC"}
          </span>
          {isTop && (
            <span className="text-[8px] uppercase tracking-wider text-amber-400 font-mono font-bold animate-pulse">
              Active
            </span>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2 pt-1 border-t border-amber-900/30 flex flex-col gap-2">
              {/* Lexical Environment */}
              <div className="rounded border border-amber-800/30 bg-amber-950/30 p-2">
                <div className="text-[9px] font-mono text-amber-600 uppercase tracking-wider mb-1">
                  Lexical Environment
                </div>
                <BindingsList
                  bindings={lexEnv?.environmentRecord?.bindings}
                />
              </div>

              {/* Variable Environment (only show if different from lexical) */}
              {varEnv && varEnv !== lexEnv && (
                <div className="rounded border border-amber-800/30 bg-amber-950/30 p-2">
                  <div className="text-[9px] font-mono text-amber-600 uppercase tracking-wider mb-1">
                    Variable Environment
                  </div>
                  <BindingsList
                    bindings={varEnv?.environmentRecord?.bindings}
                  />
                </div>
              )}

              {/* this Binding */}
              <div className="flex items-center gap-2 px-2 py-1 rounded border border-amber-800/30 bg-amber-950/30">
                <span className="text-[9px] font-mono text-amber-600 uppercase tracking-wider">
                  this
                </span>
                <ArrowRight size={10} className="text-cyan-500" />
                <span
                  className={`text-[10px] font-mono ${typeof thisBinding === "number" ? "text-cyan-400" : "text-neutral-400"}`}
                >
                  {thisDisplay}
                </span>
                {typeof thisBinding === "number" && (
                  <span className="text-[8px] text-neutral-500">(Heap)</span>
                )}
              </div>

              {/* Outer Reference */}
              <div className="flex items-center gap-2 px-2 py-1 rounded border border-amber-800/30 bg-amber-950/30">
                <span className="text-[9px] font-mono text-amber-600 uppercase tracking-wider">
                  Outer
                </span>
                <ArrowRight size={10} className="text-violet-500" />
                <span className="text-[10px] font-mono text-violet-400">
                  {outerDisplay}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CallStackPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const callStack =
    currentSnapshot?.runtime?.executionContextStack?.stack || [];

  return (
    <div className="h-full w-full flex flex-col bg-[#0d0d0d]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500/60" />
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Call Stack
          </span>
        </div>
        <span className="text-[10px] font-mono bg-amber-900/30 text-amber-400 px-1.5 py-0.5 rounded">
          {callStack.length} {callStack.length === 1 ? "Frame" : "Frames"}
        </span>
      </div>
      <div className="flex-1 p-2 overflow-y-auto flex flex-col-reverse gap-1.5 relative">
        {callStack.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xs font-mono text-neutral-600 italic text-center">
              <div className="text-neutral-500 mb-1">⬜</div>
              Empty Stack
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {callStack.map((frame, index) => {
              const isTop = index === callStack.length - 1;
              const isGEC = index === 0;

              return (
                <ExecutionContextCard
                  key={frame.id || index}
                  frame={frame}
                  index={index}
                  isTop={isTop}
                  isGEC={isGEC}
                  totalFrames={callStack.length}
                />
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
