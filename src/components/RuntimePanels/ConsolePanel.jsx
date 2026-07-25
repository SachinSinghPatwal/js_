import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsolePanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  const logs = currentSnapshot?.runtime?.consoleLogs || [];

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="px-3 py-1.5 border-b border-[#252526] bg-[#252526] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#d4d4d4] uppercase tracking-wider font-semibold">
          Console Output
        </span>
        <span className="text-[10px] font-mono text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1.5 py-0.5 rounded font-bold">
          {logs.length}
        </span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-1 font-mono text-[12px] custom-scrollbar">
        {logs.length === 0 ? (
          <div className="text-xs text-[#858585] italic text-center w-full mt-2">
            No console output
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log, index) => {
              const isError = log.type === "error";
              const isWarn = log.type === "warn";

              return (
                <motion.div 
                  key={index} 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start justify-between gap-2 py-1 px-1.5 rounded border-b border-[#252526] last:border-b-0 ${
                    isError
                      ? "bg-[#2a1b1c] text-[#f44747]"
                      : isWarn
                        ? "bg-[#2a261b] text-[#cca712]"
                        : ""
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className={`shrink-0 font-bold ${isError ? "text-[#f44747]" : "text-[#e2b714]"}`}>
                      {isError ? "✖" : isWarn ? "⚠" : ">"}
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[#d4d4d4] truncate">
                      {log.args?.map((arg, argIdx) => (
                        <span key={argIdx} className="text-[#d4d4d4]">
                          {typeof arg === "object" && arg !== null
                            ? `[${arg.type || "Object"}]`
                            : String(arg)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {log.line !== undefined && (
                    <span className="text-[10px] text-[#858585] shrink-0 font-mono pl-2">
                      Line {log.line}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
