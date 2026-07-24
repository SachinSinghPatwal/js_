import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
export default function HeapPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  const heapObjects = currentSnapshot?.runtime?.heap?.objects 
    ? Array.from(currentSnapshot.runtime.heap.objects.entries()) 
    : [];

  return (
    <div className="h-full w-full flex flex-col bg-[#111]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#1a1a1a] flex items-center justify-between">
        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Memory Heap</span>
        <span className="text-[10px] font-mono bg-orange-900/40 text-orange-400 px-1.5 py-0.5 rounded">
          {heapObjects.length} Objects
        </span>
      </div>
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 border-2 border-orange-900/30 m-2 rounded-lg relative">
        <div className="absolute top-1 left-2 text-[10px] font-mono text-orange-500/50 uppercase tracking-widest">Memory Heap</div>
        <div className="mt-4 flex flex-col gap-2 h-full">
          <div className="flex-1 rounded border-2 border-orange-900/60 bg-[#110a05] flex items-center justify-center p-2">
             <span className="text-orange-400 font-mono text-sm">Reference</span>
          </div>
          <div className="h-8 rounded border-2 border-yellow-900/60 bg-[#141208] flex items-center justify-center">
             <span className="text-yellow-400 font-mono text-xs">this</span>
          </div>
          <div className="h-8 rounded border-2 border-orange-900/60 bg-[#110a05] flex items-center justify-center">
             <span className="text-orange-500/70 font-mono text-xs">GC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
