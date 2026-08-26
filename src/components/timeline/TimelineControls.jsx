import { useSelector } from "react-redux";
import { selectSnapshots, selectCurrentStep } from "../../store/selectors";
import { useTimelinePlayback } from "./useTimelinePlayback";
import PlaybackControls from "./PlaybackControls";
import TimelineProgressBar from "./TimelineProgressBar";
import PanelToggleGroup from "./PanelToggleGroup";
import PlaybackSpeedSelector from "./PlaybackSpeedSelector";

export default function TimelineControls({ panels, togglePanel }) {
  const snapshots = useSelector(selectSnapshots);
  const currentStep = useSelector(selectCurrentStep);

  const {
    isPlaying,
    speed,
    setSpeed,
    togglePlay,
    handleStepNext,
    handleStepPrev,
    handleReset,
    handleSeek,
  } = useTimelinePlayback(2000);

  const totalSteps = Math.max(0, snapshots.length - 1);
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="flex items-center gap-3 px-3.5 py-1.5 bg-[#252526] border border-[#2d2d2d] rounded-xl shadow-lg font-mono">
      <PlaybackControls
        isPlaying={isPlaying}
        currentStep={currentStep}
        snapshotsLength={snapshots.length}
        onReset={handleReset}
        onPrev={handleStepPrev}
        onTogglePlay={togglePlay}
        onNext={handleStepNext}
      />

      <TimelineProgressBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        progress={progress}
        onSeek={handleSeek}
      />

      <PanelToggleGroup panels={panels} togglePanel={togglePanel} />

      <PlaybackSpeedSelector speed={speed} setSpeed={setSpeed} />
    </div>
  );
}
