import { useSyncExternalStore, useState } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";

function BindingsList({ bindings }) {
  if (!bindings || bindings.size === 0) {
    return (
      <span className="text-[#858585] italic text-[10px]">No bindings</span>
    );
  }

  const entries = Array.from(bindings.entries());

  return (
    <div className="flex flex-col gap-0.5 font-mono">
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
            <span className="text-[#e2b714] font-medium text-[10px]">
              {name}
            </span>
            <span className="text-[#858585] text-[10px]">:</span>
            <span
              className={`text-[10px] ${isRef ? "text-[#e2b714]" : "text-[#d4d4d4]"}`}
            >
              {displayVal}
            </span>
            {!binding?.initialized && (
              <span className="text-[8px] text-[#f44747] bg-[#1e1e1e] border border-[#2d2d2d] px-1 rounded">
                TDZ
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExecutionContextCard({ frame, index, isTop, isGEC }) {
  const [expanded, setExpanded] = useState(isTop);
  const frameName = frame.scope?.name || frame.type || "anonymous";

  const lexEnv = frame.lexicalEnvironment;
  const varEnv = frame.variableEnvironment;
  const thisBinding = frame.thisBinding;
  const outerRef = frame.outerReference || lexEnv?.outer;

  const thisDisplay =
    thisBinding === undefined || thisBinding === null
      ? "undefined"
      : typeof thisBinding === "number"
        ? `→ 0x${thisBinding.toString(16).padStart(4, "0")}`
        : String(thisBinding);

  const outerDisplay = outerRef
    ? outerRef.scope?.name || "Outer Environment"
    : "null (Global)";

  return (
    <motion.div
      key={frame.id || index}
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className={`rounded border relative overflow-hidden font-mono ${
        isTop
          ? "border-[#e2b714]/80 bg-[#252526]"
          : "border-[#2d2d2d] bg-[#252526]/60"
      }`}
    >
      <div
        className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-[#1e1e1e] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[#858585]">
            {expanded ? "▼" : "▶"}
          </span>
          <span
            className={`text-[11px] font-semibold ${
              isTop ? "text-[#e2b714]" : "text-[#d4d4d4]"
            }`}
          >
            {isGEC ? "Global Execution Context" : `${frameName}()`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-[#858585] bg-[#1e1e1e] px-1.5 py-0.5 rounded border border-[#2d2d2d]">
            {frame.type === "global" ? "GEC" : "FEC"}
          </span>
          {isTop && (
            <span className="text-[8px] uppercase tracking-wider text-[#e2b714] font-bold">
              Active
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-2.5 pb-2 pt-1 border-t border-[#2d2d2d] flex flex-col gap-1.5 bg-[#1e1e1e]">
              <div className="rounded border border-[#2d2d2d] bg-[#252526] p-2">
                <div className="text-[9px] text-[#858585] uppercase tracking-wider mb-1 font-medium">
                  Lexical Environment
                </div>
                <BindingsList
                  bindings={lexEnv?.environmentRecord?.bindings}
                />
              </div>

              {varEnv && varEnv !== lexEnv && (
                <div className="rounded border border-[#2d2d2d] bg-[#252526] p-2">
                  <div className="text-[9px] text-[#858585] uppercase tracking-wider mb-1 font-medium">
                    Variable Environment
                  </div>
                  <BindingsList
                    bindings={varEnv?.environmentRecord?.bindings}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 px-2 py-1 rounded border border-[#2d2d2d] bg-[#252526] text-[10px]">
                <span className="text-[#858585] uppercase font-medium">this</span>
                <span className="text-[#858585]">→</span>
                <span
                  className={
                    typeof thisBinding === "number"
                      ? "text-[#e2b714] font-semibold"
                      : "text-[#d4d4d4]"
                  }
                >
                  {thisDisplay}
                </span>
              </div>

              <div className="flex items-center gap-2 px-2 py-1 rounded border border-[#2d2d2d] bg-[#252526] text-[10px]">
                <span className="text-[#858585] uppercase font-medium">Outer</span>
                <span className="text-[#858585]">→</span>
                <span className="text-[#d4d4d4]">{outerDisplay}</span>
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
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="px-3 py-1.5 border-b border-[#252526] bg-[#252526] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#d4d4d4] uppercase tracking-wider font-semibold">
          Call Stack
        </span>
        <span className="text-[10px] font-mono text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1.5 py-0.5 rounded font-bold">
          {callStack.length} {callStack.length === 1 ? "Frame" : "Frames"}
        </span>
      </div>
      <div className="flex-1 p-2 overflow-y-auto flex flex-col-reverse gap-1.5 custom-scrollbar">
        {callStack.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs font-mono text-[#858585] italic">
              Empty Stack
            </span>
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
                />
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
