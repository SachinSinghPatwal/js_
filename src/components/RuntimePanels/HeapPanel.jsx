import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

export default function HeapPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  const heapObjects = currentSnapshot?.runtime?.heap?.objects 
    ? Array.from(currentSnapshot.runtime.heap.objects.entries()) 
    : [];

  const handleKnowMore = (address, obj) => {
    const isFunction = obj.type === "Function";
    const isPromise = obj.type === "Promise";

    const detailsData = (
      <div className="flex flex-col gap-3">
        {isFunction && (
          <div className="flex flex-col gap-2">
            <span className="text-blue-300 font-semibold">{obj.name || "anonymous"}()</span>
            <div className="text-neutral-500">Captured Environment (Closure):</div>
            {obj.capturedEnvironment && obj.capturedEnvironment.size > 0 ? (
              <div className="flex flex-col gap-1 bg-[#0a0a0a] border border-[#222] p-2 rounded">
                {Array.from(obj.capturedEnvironment.entries()).map(([k, v]) => (
                  <div key={k} className="flex border-b border-[#333] pb-1">
                    <span className="text-pink-400 w-1/3 truncate">{k}:</span>
                    <span className="text-neutral-300 w-2/3 truncate pl-1">{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-600 italic">No closure variables captured</div>
            )}
          </div>
        )}

        {isPromise && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between border-b border-[#333] pb-1">
              <span className="text-neutral-500">[[PromiseState]]</span>
              <span className={
                obj.state === "fulfilled" ? "text-green-400" : 
                obj.state === "rejected" ? "text-red-400" : "text-yellow-400"
              }>
                {obj.state}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#333] pb-1">
              <span className="text-neutral-500">[[PromiseResult]]</span>
              <span className="text-neutral-300">{obj.value !== undefined ? String(obj.value) : "undefined"}</span>
            </div>
          </div>
        )}

        {!isFunction && !isPromise && (
          <div className="flex flex-col gap-2">
            <div className="text-neutral-500">Properties:</div>
            {Object.keys(obj.properties || {}).length > 0 ? (
              <div className="flex flex-col gap-1 bg-[#0a0a0a] border border-[#222] p-2 rounded">
                {Object.entries(obj.properties || {}).map(([k, v]) => (
                  <div key={k} className="flex border-b border-[#333] pb-1">
                    <span className="text-pink-400 w-1/3 truncate">{k}:</span>
                    <span className="text-neutral-300 w-2/3 truncate pl-1">
                      {typeof v === 'object' && v !== null ? `[${v.type || 'Object'}]` : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-neutral-600 italic">Empty object</div>
            )}
          </div>
        )}
      </div>
    );

    VisualizationStore.setModalData({
      type: `Heap Object (${obj.type})`,
      title: `Address: ${address}`,
      data: detailsData
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#111]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Memory Heap</span>
        <span className="text-[10px] font-mono bg-orange-900/40 text-orange-400 px-1.5 py-0.5 rounded">
          {heapObjects.length} Objects
        </span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex flex-wrap gap-2 content-start">
        {heapObjects.length === 0 ? (
          <div className="text-xs font-mono text-neutral-600 italic text-center w-full mt-4">
            Empty Heap
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {heapObjects.map(([address, obj]) => (
              <motion.div 
                key={address} 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                className="rounded border border-[#333] bg-[#1a1a1a] p-2 flex items-center gap-3 shadow-sm transition-all hover:border-orange-500/50"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-orange-400 bg-orange-950/30 px-1.5 py-0.5 rounded w-max">
                    {address}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-300">
                    {obj.type}
                  </span>
                </div>

                <button 
                  onClick={() => handleKnowMore(address, obj)}
                  className="p-1.5 ml-2 rounded hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
                  title="Know More"
                >
                  <Info size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
