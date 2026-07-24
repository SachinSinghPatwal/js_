import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";

export default function EventLoopPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  const eventLoop = currentSnapshot?.runtime?.eventLoop;
  const isIdle = !eventLoop || eventLoop.phase === "IDLE";
  
  return (
    <div className="h-full w-full flex flex-col bg-[#111]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Event Loop</span>
        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${isIdle ? "bg-neutral-800 text-neutral-400" : "bg-green-900/40 text-green-400 animate-pulse"}`}>
          {isIdle ? "Idle" : "Running"}
        </span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex items-center justify-center relative">
        <div className={`absolute inset-0 flex items-center justify-center opacity-10`}>
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-neutral-500 animate-[spin_10s_linear_infinite]" />
        </div>
        
        <div className={`relative z-10 w-24 h-24 rounded-full border-4 ${isIdle ? "border-neutral-700" : "border-neutral-700 border-t-green-500 animate-spin"} flex flex-col items-center justify-center bg-[#0a0a0a] shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
          <span className="text-[10px] font-mono text-neutral-500 text-center px-2" style={{ animation: isIdle ? "none" : "spin 1s linear infinite reverse" }}>
            {eventLoop?.phase || "IDLE"}
          </span>
        </div>

        {eventLoop?.currentTask && (
          <div className="absolute bottom-2 right-2 text-[10px] font-mono text-neutral-400 bg-[#1a1a1a] px-2 py-1 rounded border border-[#333]">
            Task: {eventLoop.currentTask.type}
          </div>
        )}
      </div>
    </div>
  );
}
