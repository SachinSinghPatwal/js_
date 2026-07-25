import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function WebAPIPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const webAPIs = currentSnapshot?.runtime?.webAPIs
    ? Array.from(currentSnapshot.runtime.webAPIs.entries())
    : [];

  const hostEnv = currentSnapshot?.runtime?.hostEnvironment || "browser";
  const isBrowser = hostEnv === "browser";

  const availableAPIs = isBrowser
    ? ["Timer", "DOM", "Fetch", "MutationObserver"]
    : ["Timers", "libuv", "FS", "DNS", "TCP", "nextTick"];

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="px-3 py-1.5 border-b border-[#252526] bg-[#252526] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#d4d4d4] uppercase tracking-wider font-semibold">
          Host APIs
        </span>
        <span className="text-[9px] font-mono bg-[#1e1e1e] border border-[#2d2d2d] text-[#e2b714] px-1.5 py-0.5 rounded font-bold">
          {isBrowser ? "Browser Host" : "Node.js Runtime"}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2 custom-scrollbar font-mono">
        <div className="flex flex-wrap gap-1">
          {availableAPIs.map((api) => (
            <span
              key={api}
              className="text-[8px] text-[#858585] bg-[#252526] border border-[#2d2d2d] px-1.5 py-0.5 rounded"
            >
              {api}
            </span>
          ))}
        </div>

        <div className="border-t border-dashed border-[#2d2d2d] my-0.5" />

        <div className="flex flex-col gap-1">
          {webAPIs.length === 0 ? (
            <div className="flex items-center justify-center py-2">
              <span className="text-[10px] text-[#858585] italic">
                No active background tasks
              </span>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {webAPIs.map(([id, api]) => {
                return (
                  <motion.div
                    key={id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded border border-[#2d2d2d] bg-[#252526] p-1.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#d4d4d4] font-medium">
                        {api.label || api.type}
                      </span>
                      {api.delay !== undefined && (
                        <span className="text-[8px] text-[#858585]">
                          {api.delay}ms delay
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1 rounded font-bold">
                      Background
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
