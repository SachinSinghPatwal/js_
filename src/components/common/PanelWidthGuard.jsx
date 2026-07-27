import { useState, useEffect, useRef } from "react";

export default function PanelWidthGuard({
  minWidth = 260,
  minHeight = 140,
  label = "Panel",
  children,
}) {
  const containerRef = useRef(null);
  const [isTooSmall, setIsTooSmall] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (
          (width > 0 && width < minWidth) ||
          (height > 0 && height < minHeight)
        ) {
          setIsTooSmall(true);
        } else {
          setIsTooSmall(false);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [minWidth, minHeight]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {children}
      {isTooSmall && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#181818]/95 backdrop-blur-xs p-2 overflow-hidden">
          <div className="bg-[#252526] border border-[#3c3e41] rounded-lg shadow-2xl px-3 py-2.5 text-center max-w-[95%] w-fit font-mono flex flex-col items-center justify-center gap-1 shrink-0 overflow-hidden">
            <span className="text-[10px] font-semibold text-[#e2b714] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              {label} Too Small
            </span>
            <span className="text-[9px] text-[#858585] whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              Drag border to expand
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
