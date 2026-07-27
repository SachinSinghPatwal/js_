import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../../visualization/store/VisualizationStore";
import { AnimatePresence } from "framer-motion";
import ExecutionContextCard from "./ExecutionContextCard";

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
                  key={`${frame.name || "anonymous"}-${frame.id ?? index}`}
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
