import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

const JOB_COLORS = {
  PromiseReactionJob: {
    border: "border-violet-600/50",
    bg: "bg-violet-950/30",
    text: "text-violet-300",
    badge: "bg-violet-900/50 text-violet-200",
  },
  MutationObserverJob: {
    border: "border-purple-600/50",
    bg: "bg-purple-950/30",
    text: "text-purple-300",
    badge: "bg-purple-900/50 text-purple-200",
  },
  default: {
    border: "border-violet-600/40",
    bg: "bg-violet-950/20",
    text: "text-violet-300",
    badge: "bg-violet-900/40 text-violet-200",
  },
};

export default function MicroQueuePanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const microtasks = currentSnapshot?.runtime?.microtaskQueue || [];

  const handleInspect = (task) => {
    VisualizationStore.setModalData({
      type: "Microtask Job",
      title: task.type || "Job",
      data: {
        type: task.type,
        callbackName: task.callback?.name || task.callback?.node?.id?.name || "(anonymous)",
        args: task.args,
      },
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0d0d0d]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500/60" />
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Microtask Queue
          </span>
        </div>
        <span className="text-[10px] font-mono bg-violet-900/30 text-violet-400 px-1.5 py-0.5 rounded">
          {microtasks.length} {microtasks.length === 1 ? "Job" : "Jobs"}
        </span>
      </div>
      <div className="flex-1 p-2 overflow-x-auto flex items-start gap-1.5 relative min-h-[60px]">
        {microtasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full">
            <span className="text-[10px] font-mono text-neutral-600 italic">
              Empty Queue
            </span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {microtasks.map((task, index) => {
              const colors = JOB_COLORS[task.type] || JOB_COLORS.default;
              const callbackName =
                task.callback?.name ||
                task.callback?.node?.id?.name ||
                "callback";

              return (
                <motion.div
                  key={`micro-${index}`}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                  onClick={() => handleInspect(task)}
                  className={`rounded-lg border ${colors.border} ${colors.bg} px-2.5 py-1.5 flex flex-col gap-0.5 cursor-pointer hover:bg-white/[0.03] transition-all min-w-[120px] shrink-0`}
                >
                  <div className="flex items-center gap-1.5">
                    <Zap size={10} className={colors.text} />
                    <span className={`text-[9px] font-mono font-semibold ${colors.text}`}>
                      {task.type || "Job"}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 pl-3.5">
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
