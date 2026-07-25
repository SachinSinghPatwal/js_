import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion } from "framer-motion";
import { ArrowDown, Check, Zap, Eye, Play } from "lucide-react";

const BROWSER_PHASES = [
  { id: "CHECK_STACK_EMPTY", label: "Call Stack Empty?", icon: Check, color: "amber" },
  { id: "DRAIN_MICROTASKS", label: "Drain Microtasks", icon: Zap, color: "violet" },
  { id: "RENDER_OPPORTUNITY", label: "Render Opportunity", icon: Eye, color: "emerald" },
  { id: "TAKE_MACROTASK", label: "Take One Macrotask", icon: Play, color: "indigo" },
];

const NODE_PHASES = [
  { id: "CHECK_STACK_EMPTY", label: "Call Stack Empty?", icon: Check, color: "amber" },
  { id: "DRAIN_NEXTTICK", label: "Drain nextTick", icon: Zap, color: "orange" },
  { id: "DRAIN_MICROTASKS", label: "Drain Microtasks", icon: Zap, color: "violet" },
  { id: "TAKE_MACROTASK", label: "Take One Macrotask", icon: Play, color: "indigo" },
];

const COLOR_MAP = {
  amber: {
    active: "border-amber-500 bg-amber-950/50 text-amber-300 shadow-amber-500/20",
    inactive: "border-neutral-800 bg-neutral-900/30 text-neutral-500",
    dot: "bg-amber-500",
    arrow: "text-amber-500",
  },
  violet: {
    active: "border-violet-500 bg-violet-950/50 text-violet-300 shadow-violet-500/20",
    inactive: "border-neutral-800 bg-neutral-900/30 text-neutral-500",
    dot: "bg-violet-500",
    arrow: "text-violet-500",
  },
  emerald: {
    active: "border-emerald-500 bg-emerald-950/50 text-emerald-300 shadow-emerald-500/20",
    inactive: "border-neutral-800 bg-neutral-900/30 text-neutral-500",
    dot: "bg-emerald-500",
    arrow: "text-emerald-500",
  },
  indigo: {
    active: "border-indigo-500 bg-indigo-950/50 text-indigo-300 shadow-indigo-500/20",
    inactive: "border-neutral-800 bg-neutral-900/30 text-neutral-500",
    dot: "bg-indigo-500",
    arrow: "text-indigo-500",
  },
  orange: {
    active: "border-orange-500 bg-orange-950/50 text-orange-300 shadow-orange-500/20",
    inactive: "border-neutral-800 bg-neutral-900/30 text-neutral-500",
    dot: "bg-orange-500",
    arrow: "text-orange-500",
  },
};

export default function EventLoopPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const eventLoop = currentSnapshot?.eventLoopPhase || currentSnapshot?.runtime?.eventLoop;
  const currentPhase = eventLoop?.phase || "IDLE";
  const phaseStep = eventLoop?.currentPhaseStep || null;
  const hostEnv = currentSnapshot?.runtime?.hostEnvironment || "browser";

  const isIdle = currentPhase === "IDLE";
  const isSyncExec = currentPhase === "EXECUTING_SYNC" || currentPhase === "SYNC_COMPLETE";

  const phases = hostEnv === "node" ? NODE_PHASES : BROWSER_PHASES;

  // Determine which phase is active for highlighting
  const activePhaseId =
    currentPhase === "CREATE_EC" || currentPhase === "EXECUTE"
      ? "TAKE_MACROTASK" // Group EC creation and execution under macrotask phase
      : currentPhase;

  return (
    <div className="h-full w-full flex flex-col bg-[#0d0d0d]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isIdle ? "bg-neutral-600" : "bg-yellow-500 animate-pulse"}`}
          />
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Event Loop
          </span>
        </div>
        <span
          className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
            isIdle
              ? "bg-neutral-800 text-neutral-400"
              : isSyncExec
                ? "bg-amber-900/40 text-amber-400"
                : "bg-yellow-900/40 text-yellow-400 animate-pulse"
          }`}
        >
          {isIdle ? "Idle" : isSyncExec ? "Sync" : "Looping"}
        </span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto flex flex-col items-center justify-center gap-0">
        {isSyncExec && (
          <div className="mb-3 px-3 py-1.5 rounded border border-amber-700/40 bg-amber-950/30 text-center">
            <span className="text-[10px] font-mono text-amber-400">
              {currentPhase === "EXECUTING_SYNC"
                ? "▶ Executing synchronous code..."
                : "✓ Synchronous code complete"}
            </span>
          </div>
        )}

        {/* Phase Pipeline */}
        {phases.map((phase, index) => {
          const isActive = activePhaseId === phase.id && !isIdle && !isSyncExec;
          const isPast = false; // Could track this for completed phases
          const colors = COLOR_MAP[phase.color];
          const Icon = phase.icon;

          return (
            <div key={phase.id} className="flex flex-col items-center w-full">
              {/* Phase Box */}
              <motion.div
                animate={
                  isActive
                    ? { scale: [1, 1.02, 1], opacity: 1 }
                    : { scale: 1, opacity: isIdle ? 0.4 : 0.6 }
                }
                transition={
                  isActive
                    ? { repeat: Infinity, duration: 1.5 }
                    : { duration: 0.3 }
                }
                className={`w-full max-w-[200px] rounded-lg border px-3 py-2 text-center transition-all duration-300 ${
                  isActive
                    ? `${colors.active} shadow-lg`
                    : colors.inactive
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Icon size={11} />
                  <span className="text-[10px] font-mono font-medium">
                    {phase.label}
                  </span>
                </div>
                {isActive && phaseStep && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[8px] font-mono mt-1 opacity-70"
                  >
                    {phaseStep}
                  </motion.div>
                )}
              </motion.div>

              {/* Arrow between phases */}
              {index < phases.length - 1 && (
                <div className="py-0.5 flex items-center justify-center">
                  <ArrowDown
                    size={12}
                    className={
                      isActive && !isIdle
                        ? colors.arrow
                        : "text-neutral-700"
                    }
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Loop-back indicator */}
        {!isIdle && !isSyncExec && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="mt-1 text-[9px] font-mono text-yellow-500/60 flex items-center gap-1"
          >
            ↻ Loop back
          </motion.div>
        )}
      </div>
    </div>
  );
}
