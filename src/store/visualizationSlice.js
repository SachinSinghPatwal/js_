import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { invokeExecuteCallback } from "./executeCallbackRegistry";

/**
 * Async thunk that triggers the imperative "execute code" callback
 * registered by CodeEditor. The actual snapshot dispatching still happens
 * inside the callback (CodeEditor calls dispatch(addSnapshot(...))).
 */
export const executeCode = createAsyncThunk(
  "visualization/executeCode",
  async () => {
    await invokeExecuteCallback();
  }
);

const visualizationSlice = createSlice({
  name: "visualization",
  initialState: {
    snapshots: [],
    currentStep: 0,
    modalData: null, // null | { type, title, data }
  },
  reducers: {
    addSnapshot(state, action) {
      state.snapshots.push(action.payload);
      state.currentStep = state.snapshots.length - 1;
    },
    nextStep(state) {
      if (state.currentStep < state.snapshots.length - 1) {
        state.currentStep += 1;
      }
    },
    prevStep(state) {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    jumpToStep(state, action) {
      const step = action.payload;
      if (step >= 0 && step < state.snapshots.length) {
        state.currentStep = step;
      }
    },
    reset(state) {
      state.snapshots = [];
      state.currentStep = 0;
      state.modalData = null;
    },
    setModalData(state, action) {
      state.modalData = action.payload;
    },
  },
});

export const {
  addSnapshot,
  nextStep,
  prevStep,
  jumpToStep,
  reset,
  setModalData,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;
