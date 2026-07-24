import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

export default function MacroQueuePanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  const macrotasks = currentSnapshot?.runtime?.macrotaskQueue || [];

  const handleKnowMore = (task) => {
    VisualizationStore.setModalData({
      type: "Macrotask",
      title: task.type === "Timeout" ? "setTimeout" : task.type,
      data: (
        <div className="flex flex-col gap-2">
          <div className="text-neutral-500">Details:</div>
          <div className="text-neutral-300">Type: {task.type}</div>
          <div className="text-neutral-300">Arguments: {task.args?.length || 0}</div>
        </div>
      )
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#111]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Macrotask Queue</span>
        <span className="text-[10px] font-mono bg-purple-900/40 text-purple-400 px-1.5 py-0.5 rounded">
          {macrotasks.length}
        </span>
      </div>
      <div className="flex-1 p-3 overflow-x-auto flex items-center gap-2 border-2 border-blue-900/30 m-2 rounded-lg relative min-h-[80px]">
        <div className="absolute top-1 left-2 text-[10px] font-mono text-blue-500/50 uppercase tracking-widest">Macro Task Queue</div>
        <div className="mt-4 flex flex-row gap-2 w-max">
        {macrotasks.length === 0 ? (
          <div className="text-xs font-mono text-neutral-600 italic mt-2">
            Empty Queue
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {macrotasks.map((task, index) => (
              <motion.div 
                key={index} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="rounded border-2 border-blue-600/50 bg-[#1a1c24] px-3 py-2 flex items-center justify-between gap-3 shadow-sm min-w-[120px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-blue-300">
                    {task.type === "Timeout" ? "setTimeout" : task.type}
                  </span>
                </div>
                <button 
                  onClick={() => handleKnowMore(task)}
                  className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
                >
                  <Info size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        </div>
      </div>
    </div>
  );
}
