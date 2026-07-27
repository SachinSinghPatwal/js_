import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../../visualization/store/VisualizationStore";
import EventLoopPhaseNode from "./EventLoopPhaseNode";

const BROWSER_PHASES = [
  { id: "CHECK_STACK_EMPTY", label: "Call Stack Empty?" },
  { id: "DRAIN_MICROTASKS", label: "Drain Microtasks" },
  { id: "RENDER_OPPORTUNITY", label: "Render Opportunity" },
  { id: "TAKE_MACROTASK", label: "Take One Macrotask" },
];

const NODE_PHASES = [
  { id: "CHECK_STACK_EMPTY", label: "Call Stack Empty?" },
  { id: "DRAIN_NEXTTICK", label: "Drain nextTick" },
  { id: "DRAIN_MICROTASKS", label: "Drain Microtasks" },
  { id: "TAKE_MACROTASK", label: "Take One Macrotask" },
];

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

  const activePhaseId =
    currentPhase === "CREATE_EC" || currentPhase === "EXECUTE"
      ? "TAKE_MACROTASK"
      : currentPhase;

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="px-3 py-[6.6px] border-b border-[#252526] bg-[#252526] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#d4d4d4] uppercase tracking-wider font-semibold">
          Event Loop
        </span>
        <span
          className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${
            isIdle
              ? "bg-[#1e1e1e] border border-[#2d2d2d] text-[#858585]"
              : isSyncExec
                ? "bg-[#1e1e1e] border border-[#2d2d2d] text-[#e2b714]"
                : "bg-[#1e1e1e] border border-[#2d2d2d] text-[#e2b714]"
          }`}
        >
          {isIdle ? "Idle" : isSyncExec ? "Sync" : "Looping"}
        </span>
      </div>

      <div className="flex-1 p-2 overflow-y-auto flex flex-col items-center justify-center gap-1 custom-scrollbar font-mono">
        {isSyncExec && (
          <div className="mb-2 px-2.5 py-1 rounded border border-[#2d2d2d] bg-[#252526] text-center w-full max-w-[190px]">
            <span className="text-[9px] text-[#e2b714] font-medium">
              {currentPhase === "EXECUTING_SYNC"
                ? "▶ Executing sync code..."
                : "✓ Sync code complete"}
            </span>
          </div>
        )}

        {phases.map((phase, index) => {
          const isActive = activePhaseId === phase.id && !isIdle && !isSyncExec;

          return (
            <EventLoopPhaseNode
              key={phase.id}
              phase={phase}
              isActive={isActive}
              isIdle={isIdle}
              phaseStep={phaseStep}
              isLast={index === phases.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}
