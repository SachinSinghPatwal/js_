import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeapObjectPreview from "./HeapObjectPreview";

function formatAddress(addr) {
  return `0x${addr.toString(16).padStart(4, "0")}`;
}

export default function HeapEntryCard({ entry, onInspect }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`rounded border border-[#2d2d2d] bg-[#252526] overflow-hidden font-mono ${
        !entry.reachable ? "opacity-40 border-dashed" : ""
      }`}
    >
      <div
        className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-[#1e1e1e] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-[#858585]">
            {expanded ? "▼" : "▶"}
          </span>
          <span className="text-[9px] text-[#e2b714] font-semibold">
            {formatAddress(entry.address)}
          </span>
          <span className="text-[8px] bg-[#1e1e1e] text-[#d4d4d4] px-1 rounded border border-[#2d2d2d]">
            {entry.typeTag}
          </span>
        </div>

        {entry.references?.length > 0 && (
          <span className="text-[8px] text-[#858585]">
            {entry.references.length} ref(s)
          </span>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-1.5 pt-0.5 border-t border-[#2d2d2d] bg-[#1e1e1e]">
              <HeapObjectPreview value={entry.value} typeTag={entry.typeTag} />

              {entry.references?.length > 0 && (
                <div className="mt-1 pt-1 border-t border-[#2d2d2d] flex items-center gap-1">
                  <span className="text-[8px] text-[#858585]">Refs:</span>
                  {entry.references.map((ref) => (
                    <span
                      key={ref}
                      className="text-[8px] text-[#e2b714] bg-[#252526] border border-[#2d2d2d] px-1 rounded cursor-pointer hover:bg-[#333333] transition-colors font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspect?.(ref);
                      }}
                    >
                      → {formatAddress(ref)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
