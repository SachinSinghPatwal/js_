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
      <div className="flex-1 p-3 overflow-y-auto flex flex-col-reverse gap-4">
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
              
              const variables = frame.lexicalEnvironment?.environmentRecord?.bindings
                ? Array.from(frame.lexicalEnvironment.environmentRecord.bindings.entries())
                : [];

              return (
                <motion.div 
                  key={frame.id || index} 
                  layout
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`rounded-lg border relative ${
                    isGEC 
                      ? "border-green-900/50 bg-[#161a16]" 
                      : isTop ? "border-blue-500/50 bg-[#151a24]" : "border-[#333] bg-[#1a1a1a]"
                  } p-2 pt-5 transition-all`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-4 rounded-t-lg flex items-center justify-center text-[8px] font-mono tracking-widest uppercase ${
                    isGEC ? "bg-green-900/40 text-green-400" : isTop ? "bg-blue-900/40 text-blue-400" : "bg-neutral-800 text-neutral-400"
                  }`}>
                    {isGEC ? "Global Execution Context" : "Execution Context"}
                  </div>

                  <div className="flex items-center justify-between mt-1 mb-2">
                    <span className={`text-xs font-mono font-semibold ${isGEC ? "text-green-300" : isTop ? "text-blue-300" : "text-neutral-300"}`}>
                      {frameName}{isGEC ? "" : "()"}
                    </span>
                    <div className="flex gap-2 items-center">
                      {isTop && (
                        <span className="text-[9px] uppercase tracking-wider text-blue-500/70 font-mono font-bold animate-pulse">
                          Active
                        </span>
                      )}
                      <button 
                        onClick={() => handleKnowMore(frame, frameName)}
                        className="p-1 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
                        title="Know More"
                      >
                        <Info size={14} />
                      </button>
                    </div>
                  </div>

                  {variables.length > 0 ? (
                    <div className="flex flex-col gap-1 bg-[#0a0a0a] rounded border border-[#222] p-1.5">
                      {variables.map(([varName, binding]) => (
                        <div key={varName} className="flex text-[10px] font-mono items-center">
                          <span className="text-pink-400 w-1/3 truncate" title={varName}>{varName}</span>
                          <span className="text-neutral-500 mx-1">:</span>
                          <span className="text-neutral-300 w-2/3 truncate" title={String(binding?.value)}>
                            {typeof binding?.value === 'object' && binding?.value !== null 
                              ? `[${binding.value.type || 'Object'}]` 
                              : String(binding?.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-neutral-600 italic bg-[#0a0a0a] rounded border border-[#222] p-1.5 text-center">
                      No local variables
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
