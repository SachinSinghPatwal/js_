import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function MacroQueuePanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const macrotasks = currentSnapshot?.runtime?.macrotaskQueue || [];

  const handleInspect = (task) => {
    VisualizationStore.setModalData({
      type: "Macrotask",
      title: task.type || "Task",
      data: {
        type: task.type,
        callbackName: task.callback?.name || task.callback?.node?.id?.name || "(anonymous)",
        args: task.args,
        timerId: task.timerId,
      },
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="px-3 py-1.5 border-b border-[#252526] bg-[#252526] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#d4d4d4] uppercase tracking-wider font-semibold">
          Macrotask Queue
        </span>
        <span className="text-[10px] font-mono text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1.5 py-0.5 rounded font-bold">
          {macrotasks.length} {macrotasks.length === 1 ? "Task" : "Tasks"}
        </span>
      </div>
      <div className="flex-1 p-2 overflow-x-auto flex items-start gap-1.5 custom-scrollbar min-h-[50px] font-mono">
        {macrotasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full">
            <span className="text-[10px] text-[#858585] italic">
              Empty Queue
            </span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {macrotasks.map((task, index) => {
              const callbackName =
                task.callback?.name ||
                task.callback?.node?.id?.name ||
                "callback";

              return (
                <motion.div
                  key={`macro-${index}`}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  onClick={() => handleInspect(task)}
                  className="rounded border border-[#2d2d2d] bg-[#252526] px-2.5 py-1.5 flex flex-col gap-0.5 cursor-pointer hover:bg-[#333333] transition-all min-w-[110px] shrink-0"
                >
                  <span className="text-[9px] font-semibold text-[#e2b714]">
                    {task.type || "Task"}
                  </span>
                  <span className="text-[9px] text-[#d4d4d4]">
                    {callbackName}()
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
