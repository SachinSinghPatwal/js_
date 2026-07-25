import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";

function formatVal(val) {
  if (val === null) return <span className="text-[#858585] italic">null</span>;
  if (val === undefined) return <span className="text-[#858585] italic">undefined</span>;
  if (typeof val === "number") {
    if (val >= 1 && val < 100000) {
      return <span className="text-[#e2b714] font-semibold">→ 0x{val.toString(16).padStart(4, "0")} (Heap)</span>;
    }
    return <span className="text-[#d4d4d4]">{val}</span>;
  }
  if (typeof val === "boolean") return <span className="text-[#d4d4d4]">{String(val)}</span>;
  if (typeof val === "string") return <span className="text-[#d4d4d4]">"{val}"</span>;
  if (typeof val === "function") return <span className="text-[#e2b714]">ƒ Function</span>;
  if (typeof val === "object") {
    if (Array.isArray(val)) return <span className="text-[#d4d4d4]">Array({val.length})</span>;
    return <span className="text-[#d4d4d4]">{val.type || val.name || "Object"}</span>;
  }
  return <span className="text-[#d4d4d4]">{String(val)}</span>;
}

function RenderJSONTree({ data, depth = 0 }) {
  if (data === null || data === undefined || typeof data !== "object") {
    return formatVal(data);
  }

  if (data instanceof Map) {
    const entries = Array.from(data.entries());
    if (entries.length === 0) return <span className="text-[#858585] italic">Map(0) {}</span>;
    return (
      <div className="flex flex-col gap-1 pl-2 border-l border-[#2d2d2d] my-1 font-mono text-[11px]">
        {entries.map(([k, v], idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-[#e2b714] font-semibold">{String(k)}</span>
            <span className="text-[#858585]">:</span>
            <RenderJSONTree data={v} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-[#858585] italic">[]</span>;
    return (
      <div className="flex flex-col gap-1 pl-2 border-l border-[#2d2d2d] my-1 font-mono text-[11px]">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-[#858585]">[{idx}]</span>
            <span className="text-[#858585]">:</span>
            <RenderJSONTree data={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  const keys = Object.keys(data).filter(
    (k) => k !== "node" && k !== "body" && k !== "runtime" && !k.startsWith("_")
  );

  if (keys.length === 0) return <span className="text-[#858585] italic">{}</span>;

  return (
    <div className="flex flex-col gap-1 pl-2 border-l border-[#2d2d2d] my-1 font-mono text-[11px]">
      {keys.map((key) => (
        <div key={key} className="flex items-start gap-2">
          <span className="text-[#e2b714]">{key}</span>
          <span className="text-[#858585]">:</span>
          <RenderJSONTree data={data[key]} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => VisualizationStore.setModalData(null)}
      >
        <motion.div 
          className="bg-[#252526] border border-[#2d2d2d] rounded-xl shadow-2xl w-[540px] max-w-[95vw] max-h-[80vh] flex flex-col overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d2d2d] bg-[#1e1e1e]">
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[9px] uppercase tracking-wider text-[#e2b714] bg-[#252526] border border-[#2d2d2d] px-1.5 py-0.5 rounded font-bold">
                {type}
              </span>
              <h3 className="text-xs font-semibold text-[#d4d4d4]">
                {title}
              </h3>
            </div>
            <button 
              className="text-[#858585] hover:text-[#d4d4d4] transition-colors text-sm px-1.5 py-0.5"
              onClick={() => VisualizationStore.setModalData(null)}
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] text-[#d4d4d4] custom-scrollbar bg-[#252526]">
            {data && typeof data === "object" && !data.props ? (
              <RenderJSONTree data={data} />
            ) : (
              data
            )}
          </div>

          <div className="px-4 py-2 border-t border-[#2d2d2d] bg-[#1e1e1e] flex items-center justify-between text-[10px] font-mono text-[#858585]">
            <span>Inspector View</span>
            <span>Esc / Click outside to close</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
