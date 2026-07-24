import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

export default function ConsolePanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  const logs = currentSnapshot?.runtime?.consoleLogs || [];

  return (
    <div className="h-full w-full flex flex-col bg-[#111]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-400">
          <Terminal size={14} />
          <span className="text-[11px] font-mono uppercase tracking-wider">Console</span>
        </div>
        <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
          {logs.length}
        </span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-1 font-mono text-[12px]">
        {logs.length === 0 ? (
          <div className="text-xs text-neutral-600 italic text-center w-full mt-2">
            No console output
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log, index) => (
              <motion.div 
                key={index} 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 py-1 border-b border-[#222] last:border-b-0"
              >
                <span className="text-neutral-500 shrink-0 mt-0.5">{'>'}</span>
                <div className="flex flex-wrap gap-1.5 text-neutral-300">
                  {log.args.map((arg, argIdx) => (
                    <span key={argIdx} className={typeof arg === 'string' ? "text-green-300" : "text-yellow-300"}>
                      {typeof arg === 'object' && arg !== null ? `[${arg.type || 'Object'}]` : String(arg)}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
