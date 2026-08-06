import test from "node:test";
import assert from "node:assert/strict";
import { VisualizationStore } from "./VisualizationStore.js";

test("addSnapshot updates the current snapshot to the newest step", () => {
  VisualizationStore.reset();

  const firstSnapshot = { step: 0, runtime: { consoleLogs: [] } };
  const secondSnapshot = {
    step: 1,
    runtime: { consoleLogs: [{ type: "log" }] },
  };

  VisualizationStore.addSnapshot(firstSnapshot);
  VisualizationStore.addSnapshot(secondSnapshot);

  const state = VisualizationStore.getSnapshot();

  assert.equal(state.currentStep, 1);
  assert.equal(state.currentSnapshot, secondSnapshot);
});
