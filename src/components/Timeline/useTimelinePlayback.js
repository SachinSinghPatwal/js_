import { useState, useEffect } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";

export function useTimelinePlayback(initialSpeed = 2000) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

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

  const togglePlay = async (snapshotsCount) => {
    if (snapshotsCount === 0) {
      await VisualizationStore.executeCode();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleStepNext = async (snapshotsCount, currentStep) => {
    if (snapshotsCount === 0) {
      await VisualizationStore.executeCode();
    }
    if (currentStep < snapshotsCount - 1) {
      VisualizationStore.nextStep();
    }
  };

  const handleStepPrev = () => {
    VisualizationStore.prevStep();
  };

  const handleReset = () => {
    setIsPlaying(false);
    VisualizationStore.reset();
    VisualizationStore.jumpToStep(0);
  };

  const handleSeek = (step) => {
    setIsPlaying(false);
    VisualizationStore.jumpToStep(step);
  };

  return {
    isPlaying,
    speed,
    setSpeed,
    togglePlay,
    handleStepNext,
    handleStepPrev,
    handleReset,
    handleSeek,
  };
}
