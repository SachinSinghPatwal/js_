import { useState, useEffect, useRef } from "react";

export default function PanelWidthGuard({ minWidth = 240, label = "Panel", children }) {
  const containerRef = useRef(null);
  const [isTooNarrow, setIsTooNarrow] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.width < minWidth) {
          setIsTooNarrow(true);
        } else {
          setIsTooNarrow(false);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [minWidth]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {children}
      {isTooNarrow && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#181818]/90 backdrop-blur-xs p-3">
          <div className="bg-[#252526] border border-[#3c3e41] rounded-lg shadow-xl px-4 py-3 text-center max-w-[90%] font-mono flex flex-col items-center gap-1">
            <span className="text-[11px] font-semibold text-[#e2b714]">
              {label} Too Narrow
            </span>
            <span className="text-[9px] text-[#858585]">
              Drag border to expand window
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
