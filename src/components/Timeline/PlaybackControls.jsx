import {
  Play,
  Pause,
  StepForward,
  StepBack,
  RotateCcw,
} from "lucide-react";

export default function PlaybackControls({
  isPlaying,
  currentStep,
  snapshotsLength,
  onReset,
  onPrev,
  onTogglePlay,
  onNext,
}) {
  const isAtEnd = snapshotsLength > 0 && currentStep >= snapshotsLength - 1;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onReset}
        className="p-1.5 text-[#858585] hover:text-[#e2b714] transition-colors"
        title="Restart"
      >
        <RotateCcw size={13} />
      </button>

      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        className="p-1.5 text-[#858585] hover:text-[#d4d4d4] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Previous Step"
      >
        <StepBack size={13} />
      </button>

      <button
        onClick={onTogglePlay}
        className="flex items-center justify-center w-6 h-6 mx-1 rounded-full bg-[#e2b714] text-[#1e1e1e] hover:bg-[#f1c40f] transition-all shadow-[0_0_12px_rgba(226,183,20,0.3)] font-bold cursor-pointer"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause size={11} fill="currentColor" />
        ) : (
          <Play size={11} fill="currentColor" className="ml-0.5" />
        )}
      </button>

      <button
        onClick={onNext}
        disabled={isAtEnd}
        className="p-1.5 text-[#858585] hover:text-[#d4d4d4] disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Next Step"
      >
        <StepForward size={13} />
      </button>
    </div>
  );
}
