import { useSyncExternalStore, useEffect, useState } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import {
  Play,
  Pause,
  StepForward,
  StepBack,
  RotateCcw,
} from "lucide-react";

export default function TimelineControls({ panels, togglePanel }) {
  const { snapshots, currentStep } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);

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
    <div className="flex items-center gap-3 px-3.5 py-1.5 bg-[#252526] border border-[#2d2d2d] rounded-xl shadow-lg font-mono">
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            VisualizationStore.reset();
            VisualizationStore.jumpToStep(0);
          }}
          className="p-1.5 text-[#858585] hover:text-[#e2b714] transition-colors"
          title="Restart"
        >
          <RotateCcw size={13} />
        </button>

        <button
          onClick={() => VisualizationStore.prevStep()}
          disabled={currentStep === 0}
          className="p-1.5 text-[#858585] hover:text-[#d4d4d4] disabled:opacity-30 transition-colors"
          title="Previous Step"
        >
          <StepBack size={13} />
        </button>

        <button
          onClick={async () => {
            if (snapshots.length === 0) {
              await VisualizationStore.executeCode();
            }
            setIsPlaying(!isPlaying);
          }}
          className="flex items-center justify-center w-6 h-6 mx-1 rounded-full bg-[#e2b714] text-[#1e1e1e] hover:bg-[#f1c40f] transition-all shadow-[0_0_12px_rgba(226,183,20,0.3)] font-bold"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={11} fill="currentColor" />
          ) : (
            <Play size={11} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        <button
          onClick={async () => {
            if (snapshots.length === 0) {
              await VisualizationStore.executeCode();
            }
            VisualizationStore.nextStep();
          }}
          disabled={snapshots.length > 0 && currentStep >= snapshots.length - 1}
          className="p-1.5 text-[#858585] hover:text-[#d4d4d4] disabled:opacity-30 transition-colors"
          title="Next Step"
        >
          <StepForward size={13} />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-2 px-3 border-l border-r border-[#2d2d2d]">
        <span className="text-[10px] text-[#858585] min-w-[1.5rem] text-right font-medium">
          {currentStep}
        </span>
        <div className="relative flex-1 h-1 bg-[#1e1e1e] rounded-full cursor-pointer">
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
            className="absolute top-0 left-0 h-full bg-[#e2b714] rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-[#858585] min-w-[1.5rem]">
          {totalSteps}
        </span>
      </div>

      <div className="flex items-center gap-1 text-[10px]">
        <button
          onClick={() => togglePanel("console")}
          className={`px-2 py-0.5 rounded transition-colors ${
            panels.console
              ? "bg-[#1e1e1e] text-[#e2b714] border border-[#2d2d2d]"
              : "text-[#858585] hover:text-[#d4d4d4]"
          }`}
        >
          Console
        </button>
        <button
          onClick={() => togglePanel("stack")}
          className={`px-2 py-0.5 rounded transition-colors ${
            panels.stack
              ? "bg-[#1e1e1e] text-[#e2b714] border border-[#2d2d2d]"
              : "text-[#858585] hover:text-[#d4d4d4]"
          }`}
        >
          Stack
        </button>
        <button
          onClick={() => togglePanel("heap")}
          className={`px-2 py-0.5 rounded transition-colors ${
            panels.heap
              ? "bg-[#1e1e1e] text-[#e2b714] border border-[#2d2d2d]"
              : "text-[#858585] hover:text-[#d4d4d4]"
          }`}
        >
          Heap
        </button>
        <button
          onClick={() => togglePanel("queues")}
          className={`px-2 py-0.5 rounded transition-colors ${
            panels.queues
              ? "bg-[#1e1e1e] text-[#e2b714] border border-[#2d2d2d]"
              : "text-[#858585] hover:text-[#d4d4d4]"
          }`}
        >
          Queues
        </button>
      </div>

      <div className="flex items-center gap-1 text-[10px] border-l border-[#2d2d2d] pl-2">
        <div className="relative group">
          <button className="px-1.5 py-0.5 rounded text-[#858585] hover:text-[#d4d4d4] transition-colors">
            {speed / 1000}s
          </button>
          <div className="absolute right-0 top-full pt-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
            <div className="bg-[#252526] border border-[#2d2d2d] rounded shadow-lg overflow-hidden py-1">
              {[500, 1000, 2000, 3000].map((s) => (
                <div
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1 cursor-pointer hover:bg-[#1e1e1e] text-[10px] ${
                    speed === s ? "text-[#e2b714] font-bold" : "text-[#d4d4d4]"
                  }`}
                >
                  {s / 1000}s
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
