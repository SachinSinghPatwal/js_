import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../../visualization/store/VisualizationStore";
import { AnimatePresence } from "framer-motion";
import ConsoleLogItem from "./ConsoleLogItem";

export default function ConsolePanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
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
            {logs.map((log, index) => (
              <ConsoleLogItem key={index} log={log} index={index} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
