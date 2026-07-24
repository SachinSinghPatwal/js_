import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function WebAPIPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  const webAPIs = currentSnapshot?.runtime?.webAPIs 
    ? Array.from(currentSnapshot.runtime.webAPIs.entries()) 
    : [];

  return (
    <div className="h-full w-full flex flex-col bg-[#111]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Web APIs</span>
        <span className="text-[10px] font-mono bg-teal-900/40 text-teal-400 px-1.5 py-0.5 rounded">
          {webAPIs.length} Active
        </span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
        {webAPIs.length === 0 ? (
          <div className="text-xs font-mono text-neutral-600 italic text-center w-full mt-2">
            No active background tasks
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {webAPIs.map(([id, api]) => (
              <motion.div 
                key={id} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="rounded border border-teal-900/50 bg-[#1a1a1a] p-2 flex flex-col gap-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-300">
                    {api.type}
                  </span>
                  <span className="text-[9px] font-mono text-teal-400 bg-teal-950/50 px-1 rounded">
                    Background
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-neutral-500">
                  <span>Delay: {api.delay || 0}ms</span>
                  <span>ID: {id}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
