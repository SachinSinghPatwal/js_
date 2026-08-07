export default function TimelineProgressBar({
  currentStep,
  totalSteps,
  progress,
  onSeek,
}) {
  return (
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
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Seek to execution step"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute top-0 left-0 h-full bg-[#e2b714] rounded-full ease-out"
          style={{ width: `${progress}%`, transition: "width 200ms ease-out" }}
        />
      </div>
      <span className="text-[10px] text-[#858585] min-w-[1.5rem]">
        {totalSteps}
      </span>
    </div>
  );
}
