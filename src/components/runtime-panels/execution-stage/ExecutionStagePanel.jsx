import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../../visualization/store/VisualizationStore";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import { useExecutionStageInfo } from "./useExecutionStageInfo";

export default function ExecutionStagePanel() {
  const { currentSnapshot, currentStep, snapshots } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const {
    isExecutionActive,
    info,
    currentNode,
    activeBindings,
    callStack,
    microtasks,
    macrotasks,
  } = useExecutionStageInfo(currentSnapshot, snapshots);

  const handleKnowMore = (e) => {
    e.stopPropagation();

    const safeBindings = activeBindings.map(([k, v]) => ({
      name: String(k),
      initialized: Boolean(v?.initialized),
      value:
        typeof v?.value === "object" && v?.value !== null
          ? `[${v.value.type || "Object"}]`
          : String(v?.value),
    }));

    VisualizationStore.setModalData({
      type: "V8 Internal Property Inspector",
      title: info.summary,
      data: {
        concept: info.details.concept,
        description: info.details.description,
        currentLocation: info.position,
        activeNodeType: currentNode?.type || "Statement",
        line: currentNode?.loc?.start?.line || 1,
        activeBindings: safeBindings,
        stackDepth: callStack.length,
        microtaskCount: microtasks.length,
        macrotaskCount: macrotasks.length,
      },
    });
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="h-full w-full flex flex-col bg-[#1e1e1e] p-3 font-mono">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#2d2d2d] shrink-0">
          <span className="text-[11px] text-[#e2b714] uppercase tracking-wider font-semibold">
            Execution Stage
          </span>
          <div className="flex items-center gap-2 text-[10px]">
            {isExecutionActive ? (
              <>
                <span className="text-[#858585]">
                  Step {currentStep} / {Math.max(0, snapshots.length - 1)}
                </span>
                <span className="px-1.5 py-0.5 rounded border border-[#2d2d2d] bg-[#252526] text-[#e2b714] text-[9px] font-bold">
                  {info.badge}
                </span>
              </>
            ) : (
              <span className="px-1.5 py-0.5 rounded border border-[#2d2d2d] bg-[#252526] text-[#858585] text-[9px]">
                Idle
              </span>
            )}
          </div>
        </div>

        {/* Centered Abstracted Knowledge & Flow Content */}
        {!isExecutionActive ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <span className="text-[12px] font-semibold text-[#858585] mb-1">
              Execution Stage Idle
            </span>
            <span className="text-[10px] text-[#646669] max-w-[240px]">
              Press Play or Step Forward in timeline controls to start visualization.
            </span>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-2 gap-3 max-w-[440px] mx-auto">
            {/* Abstracted Flow Badge */}
            <AnimatePresence mode="wait">
              <m.div
                key={`flow-${currentStep}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="px-3 py-1 rounded-full bg-[#252526] border border-[#3c3e41] text-[#e2b714] text-[10px] font-semibold shadow-md"
              >
                {info.position}
              </m.div>
            </AnimatePresence>

            {/* Concise Abstracted Summary */}
            <AnimatePresence mode="wait">
              <m.div
                key={`summary-${currentStep}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-1"
              >
                <h3 className="text-sm font-semibold text-[#d4d4d4] leading-snug">
                  {info.summary}
                </h3>
                {currentNode?.loc && (
                  <span className="text-[9px] text-[#858585]">
                    Line {currentNode.loc.start.line}:{currentNode.loc.start.column} • {currentNode.type}
                  </span>
                )}
              </m.div>
            </AnimatePresence>

            {/* Centered Know More Button */}
            <button
              type="button"
              onClick={handleKnowMore}
              className="mt-1 px-3.5 py-1.5 rounded-lg bg-[#252526] border border-[#3c3e41] text-[#e2b714] hover:bg-[#333333] hover:border-[#e2b714] transition-colors text-[10px] font-bold shadow-md flex items-center gap-1 cursor-pointer"
            >
              Know More
            </button>
          </div>
        )}
      </div>
    </LazyMotion>
  );
}
