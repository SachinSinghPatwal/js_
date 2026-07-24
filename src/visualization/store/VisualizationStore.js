let snapshots = [];
let currentStep = 0;
let listeners = new Set();

export const VisualizationStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return {
      snapshots,
      currentStep,
      currentSnapshot: snapshots[currentStep] ?? null,
    };
  },
  addSnapshot(snapshot) {
    snapshots = [...snapshots, snapshot];
    this.notify();
  },
  nextStep() {
    if (currentStep < snapshots.length - 1) {
      currentStep++;
      this.notify();
    }
  },
  prevStep() {
    if (currentStep > 0) {
      currentStep--;
      this.notify();
    }
  },
  jumpToStep(step) {
    if (step >= 0 && step < snapshots.length) {
      currentStep = step;
      this.notify();
    }
  },
  reset() {
    snapshots = [];
    currentStep = 0;
    this.notify();
  },
  notify() {
    for (const listener of listeners) {
      listener();
    }
  },
};
