/**
 * Selectors for the visualization slice.
 * Using named selectors keeps components decoupled from the state shape.
 */

export const selectSnapshots = (state) => state.visualization.snapshots;
export const selectCurrentStep = (state) => state.visualization.currentStep;
export const selectModalData = (state) => state.visualization.modalData;

/** Derived selector — computes currentSnapshot without storing it in Redux state */
export const selectCurrentSnapshot = (state) => {
  const { snapshots, currentStep } = state.visualization;
  return snapshots[currentStep] ?? null;
};
