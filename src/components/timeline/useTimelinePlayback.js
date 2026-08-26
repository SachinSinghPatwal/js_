import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  nextStep,
  prevStep,
  jumpToStep,
  reset,
  executeCode,
} from "../../store/visualizationSlice";
import {
  selectSnapshots,
  selectCurrentStep,
} from "../../store/selectors";

/** Pure function — calls dispatch inside the hook closure via handleStepNext wrapper */
async function stepNextLogic(dispatch, snapshotsCount, currentStep) {
  if (snapshotsCount === 0) {
    await dispatch(executeCode());
    // After execution, snapshotsCount is updated via Redux state; just move forward
    dispatch(nextStep());
    return;
  }
  if (currentStep < snapshotsCount - 1) {
    dispatch(nextStep());
  }
}

export function useTimelinePlayback(initialSpeed = 2000) {
  const dispatch = useDispatch();
  const snapshots = useSelector(selectSnapshots);
  const currentStep = useSelector(selectCurrentStep);

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        if (currentStep < snapshots.length - 1) {
          dispatch(nextStep());
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, speed, currentStep, snapshots.length, dispatch]);

  const handleStepNext = async () => {
    await stepNextLogic(dispatch, snapshots.length, currentStep);
  };

  const handleStepPrev = () => {
    dispatch(prevStep());
  };

  const togglePlay = async () => {
    if (snapshots.length === 0) {
      await dispatch(executeCode());
      dispatch(jumpToStep(0));
    }
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    dispatch(reset());
  };

  const handleSeek = (step) => {
    setIsPlaying(false);
    dispatch(jumpToStep(step));
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
