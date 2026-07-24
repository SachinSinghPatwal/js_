import { useSyncExternalStore, useEffect, useState } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { Play, Pause, StepForward, StepBack, RotateCcw, Layers, Database, ListOrdered, Terminal } from "lucide-react";

export default function TimelineControls({ panels, togglePanel }) {
  const { snapshots, currentStep } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000); // 2s per step for clear visibility

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        const state = VisualizationStore.getSnapshot();
        if (state.currentStep < state.snapshots.length - 1) {
          VisualizationStore.nextStep();
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, speed]);

  const totalSteps = Math.max(0, snapshots.length - 1);
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-[#0a0a0a] border-b border-[#222]">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            VisualizationStore.reset();
            VisualizationStore.jumpToStep(0);
          }}
          className="p-1.5 text-neutral-400 hover:text-white transition-colors"
          title="Restart"
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={() => VisualizationStore.prevStep()}
          disabled={currentStep === 0}
          className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
          title="Previous Step"
        >
          <StepBack size={14} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={snapshots.length === 0}
          className="flex items-center justify-center w-7 h-7 mx-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={12} fill="currentColor" />
          ) : (
            <Play size={12} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        <button
          onClick={() => VisualizationStore.nextStep()}
          disabled={currentStep >= snapshots.length - 1}
          className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
          title="Next Step"
        >
          <StepForward size={14} />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-3 group px-4 border-l border-r border-[#333]">
        <span className="text-[10px] font-mono text-neutral-500 min-w-[2rem] text-right">
          {currentStep}
        </span>
        <div className="relative flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden cursor-pointer">
          <input
            type="range"
            min={0}
            max={totalSteps}
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              VisualizationStore.jumpToStep(Number(e.target.value));
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-neutral-500 min-w-[2rem]">
          {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => togglePanel("console")}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono transition-colors ${panels.console ? "bg-green-900/30 text-green-400" : "bg-transparent text-neutral-500 hover:text-neutral-300"}`}
        >
          <Terminal size={12} />
          Console
        </button>
        <button
          onClick={() => togglePanel("stack")}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono transition-colors ${panels.stack ? "bg-blue-900/30 text-blue-400" : "bg-transparent text-neutral-500 hover:text-neutral-300"}`}
        >
          <Layers size={12} />
          Stack
        </button>
        <button
          onClick={() => togglePanel("heap")}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono transition-colors ${panels.heap ? "bg-orange-900/30 text-orange-400" : "bg-transparent text-neutral-500 hover:text-neutral-300"}`}
        >
          <Database size={12} />
          Heap
        </button>
        <button
          onClick={() => togglePanel("queues")}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono transition-colors ${panels.queues ? "bg-purple-900/30 text-purple-400" : "bg-transparent text-neutral-500 hover:text-neutral-300"}`}
        >
          <ListOrdered size={12} />
          Queues
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 border-l border-[#333] pl-3 ml-1">
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bg-transparent border-none outline-none cursor-pointer hover:text-white transition-colors"
        >
          <option value={2000}>0.5x</option>
          <option value={1000}>1.0x</option>
          <option value={500}>2.0x</option>
          <option value={250}>4.0x</option>
        </select>
      </div>
    </div>
  );
}
