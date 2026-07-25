import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MessageSquare, Globe, Monitor } from "lucide-react";

const TASK_CONFIG = {
  TimerTask: { icon: Clock, color: "indigo", label: "Timer Task" },
  MessageTask: { icon: MessageSquare, color: "blue", label: "Message Task" },
  FetchTask: { icon: Globe, color: "teal", label: "Fetch Task" },
  UITask: { icon: Monitor, color: "emerald", label: "UI Task" },
  Timeout: { icon: Clock, color: "indigo", label: "Timer Task" }, // Legacy fallback
};

const TASK_COLORS = {
  indigo: {
    border: "border-indigo-600/50",
    bg: "bg-indigo-950/30",
    text: "text-indigo-300",
  },
  blue: {
    border: "border-blue-600/50",
    bg: "bg-blue-950/30",
    text: "text-blue-300",
  },
  teal: {
    border: "border-teal-600/50",
    bg: "bg-teal-950/30",
    text: "text-teal-300",
  },
  emerald: {
    border: "border-emerald-600/50",
    bg: "bg-emerald-950/30",
    text: "text-emerald-300",
  },
};

export default function MacroQueuePanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const macrotasks = currentSnapshot?.runtime?.macrotaskQueue || [];

  const handleInspect = (task) => {
    VisualizationStore.setModalData({
      type: "Macrotask",
      title: TASK_CONFIG[task.type]?.label || task.type || "Task",
      data: {
        type: task.type,
        callbackName: task.callback?.name || task.callback?.node?.id?.name || "(anonymous)",
        args: task.args,
        timerId: task.timerId,
      },
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0d0d0d]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500/60" />
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Macrotask Queue
          </span>
        </div>
        <span className="text-[10px] font-mono bg-indigo-900/30 text-indigo-400 px-1.5 py-0.5 rounded">
          {macrotasks.length} {macrotasks.length === 1 ? "Task" : "Tasks"}
        </span>
      </div>
      <div className="flex-1 p-2 overflow-x-auto flex items-start gap-1.5 relative min-h-[60px]">
        {macrotasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full">
            <span className="text-[10px] font-mono text-neutral-600 italic">
              Empty Queue
            </span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {macrotasks.map((task, index) => {
              const config = TASK_CONFIG[task.type] || TASK_CONFIG.TimerTask;
              const colors = TASK_COLORS[config.color] || TASK_COLORS.indigo;
              const Icon = config.icon;
              const callbackName =
                task.callback?.name ||
                task.callback?.node?.id?.name ||
                "callback";

              return (
                <motion.div
                  key={`macro-${index}`}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                  onClick={() => handleInspect(task)}
                  className={`rounded-lg border ${colors.border} ${colors.bg} px-2.5 py-1.5 flex flex-col gap-0.5 cursor-pointer hover:bg-white/[0.03] transition-all min-w-[120px] shrink-0`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon size={10} className={colors.text} />
                    <span className={`text-[9px] font-mono font-semibold ${colors.text}`}>
                      {config.label}
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
