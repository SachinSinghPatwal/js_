let snapshots = [];
let currentStep = 0;
let listeners = new Set();
let modalData = null; // null or { type: 'HeapObject', data: obj }

let cachedState = null;

export const VisualizationStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    if (!cachedState) {
      cachedState = {
        snapshots,
        currentStep,
        currentSnapshot: snapshots[currentStep] ?? null,
        modalData
      };
    }
    return cachedState;
  },
  setModalData(data) {
    modalData = data;
    this.notify();
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
    modalData = null;
    this.notify();
  },
  notify() {
    cachedState = null;
    for (const listener of listeners) {
      listener();
    }
  },
  setExecuteCallback(cb) {
    this._executeCallback = cb;
  },
  async executeCode() {
    if (this._executeCallback) {
      await this._executeCallback();
    }
  }
};
