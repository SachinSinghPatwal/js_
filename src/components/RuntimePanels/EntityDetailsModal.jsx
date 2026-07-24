import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EntityDetailsModal() {
  const { modalData } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot()
  );

  if (!modalData) return null;

  const { type, title, data } = modalData;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => VisualizationStore.setModalData(null)}
      >
        <motion.div 
          className="bg-[#0f0f0f] border border-[#333] rounded-xl shadow-2xl w-[500px] max-w-[90vw] max-h-[80vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                {type}
              </span>
              <span className="text-sm font-mono text-white font-medium">
                {title}
              </span>
            </div>
            <button 
              className="text-neutral-400 hover:text-white transition-colors"
              onClick={() => VisualizationStore.setModalData(null)}
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 font-mono text-[12px] text-neutral-300">
            {data}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
