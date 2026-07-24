import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

export default function CallStackPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  const callStack = currentSnapshot?.runtime?.executionContextStack?.stack || [];

  const handleKnowMore = (frame, frameName) => {
    const variables = frame.lexicalEnvironment?.environmentRecord?.bindings
      ? Array.from(frame.lexicalEnvironment.environmentRecord.bindings.entries())
      : [];

    const detailsData = (
      <div className="flex flex-col gap-2">
        <div className="text-neutral-500 mb-2">Scope Variables:</div>
        {variables.length > 0 ? (
          variables.map(([varName, binding]) => (
            <div key={varName} className="flex border-b border-[#333] pb-1">
              <span className="text-pink-400 w-1/3 truncate">{varName}:</span>
              <span className="text-neutral-300 w-2/3 truncate pl-2">
                {typeof binding?.value === 'object' && binding?.value !== null 
                  ? `[${binding.value.type || 'Object'}]` 
                  : String(binding?.value)}
              </span>
            </div>
          ))
        ) : (
          <div className="text-neutral-600 italic">No local variables</div>
        )}
      </div>
    );

    VisualizationStore.setModalData({
      type: "Stack Frame",
      title: frameName,
      data: detailsData
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#111]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Call Stack</span>
        <span className="text-[10px] font-mono bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded">
          {callStack.length} Frames
        </span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex flex-col-reverse gap-2 border-2 border-orange-900/30 m-2 rounded-lg relative">
        <div className="absolute top-1 left-2 text-[10px] font-mono text-orange-500/50 uppercase tracking-widest">Stack Container</div>
        <div className="mt-4 flex flex-col-reverse gap-2 w-full">
        {callStack.length === 0 ? (
          <div className="text-xs font-mono text-neutral-600 italic text-center mt-4">
            Empty Stack
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {callStack.map((frame, index) => {
              const isTop = index === callStack.length - 1;
              const isGEC = index === 0;
              const frameName = frame.scope?.name || frame.type || "anonymous";

              return (
                <motion.div 
                  key={frame.id || index} 
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`rounded border-2 relative ${
                    isTop ? "border-orange-500 bg-[#1a110a]" : "border-orange-900/60 bg-[#110a05]"
                  } px-3 py-2 flex items-center justify-between transition-all`}
                >
                  <span className={`text-[11px] font-mono font-semibold ${isTop ? "text-orange-300" : "text-orange-500/70"}`}>
                    {frameName}{isGEC ? "" : "()"}
                  </span>
                  
                  <div className="flex gap-2 items-center">
                    {isTop && (
                      <span className="text-[9px] uppercase tracking-wider text-orange-500/70 font-mono font-bold animate-pulse">
                        Active
                      </span>
                    )}
                    <button 
                      onClick={() => handleKnowMore(frame, frameName)}
                      className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-orange-400 transition-colors"
                      title="Know More"
                    >
                      <Info size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        </div>
      </div>
    </div>
  );
}
