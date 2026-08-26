import { configureStore } from "@reduxjs/toolkit";
import visualizationReducer from "./visualizationSlice";

export const store = configureStore({
  reducer: {
    visualization: visualizationReducer,
  },
  // Disable the serializable check for snapshot data which may contain
  // class instances (Heap, EnvironmentRecord, etc.)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
