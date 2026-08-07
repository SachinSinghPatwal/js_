import { useEffect, useState } from "react";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import EnvironmentBindingsList from "./EnvironmentBindingsList";

export default function ExecutionContextCard({ frame, index, isTop, isGEC }) {
  const [expanded, setExpanded] = useState(isTop);

  useEffect(() => {
    setExpanded(isTop);
  }, [isTop]);

  const frameName = frame.scope?.name || frame.type || "anonymous";

  const lexEnv = frame.lexicalEnvironment;
  const varEnv = frame.variableEnvironment;
  const thisBinding = frame.thisBinding;
  const outerRef = frame.outerReference || lexEnv?.outer;

  const thisDisplay =
    thisBinding === undefined || thisBinding === null
      ? "undefined"
      : typeof thisBinding === "number"
        ? `→ 0x${thisBinding.toString(16).padStart(4, "0")}`
        : String(thisBinding);

  const outerDisplay = outerRef
    ? outerRef.scope?.name || "Outer Environment"
    : "null (Global)";

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key={frame.id || index}
        layout
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        className={`rounded border relative overflow-hidden font-mono flex flex-col ${
          isTop
            ? "border-[#e2b714]/80 bg-[#252526]"
            : "border-[#2d2d2d] bg-[#252526]/60"
        }`}
      >
        <div
          className="flex items-center justify-between px-2.5 py-1.5 cursor-pointer hover:bg-[#1e1e1e] transition-colors"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-[#858585]">
              {expanded ? "▼" : "▶"}
            </span>
            <span
              className={`text-[11px] font-semibold ${
                isTop ? "text-[#e2b714]" : "text-[#d4d4d4]"
              }`}
            >
              {isGEC ? "Global Execution Context" : `${frameName}()`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-[#858585] bg-[#1e1e1e] px-1.5 py-0.5 rounded border border-[#2d2d2d]">
              {frame.type === "global" ? "GEC" : "FEC"}
            </span>
            {isTop && (
              <span className="text-[8px] uppercase tracking-wider text-[#e2b714] font-bold">
                Active
              </span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              style={{ overflow: "hidden" }}
              className="overflow-hidden"
            >
              <div className="px-2.5 pb-2 pt-1 border-t border-[#2d2d2d] flex flex-col gap-1.5 bg-[#1e1e1e] max-h-70 overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
                <div className="rounded border border-[#2d2d2d] bg-[#252526] p-2">
                  <div className="text-[9px] text-[#858585] uppercase tracking-wider mb-1 font-medium">
                    Lexical Environment
                  </div>
                  <EnvironmentBindingsList
                    bindings={lexEnv?.environmentRecord?.bindings}
                  />
                </div>

                {varEnv && varEnv !== lexEnv && (
                  <div className="rounded border border-[#2d2d2d] bg-[#252526] p-2">
                    <div className="text-[9px] text-[#858585] uppercase tracking-wider mb-1 font-medium">
                      Variable Environment
                    </div>
                    <EnvironmentBindingsList
                      bindings={varEnv?.environmentRecord?.bindings}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 px-2 py-1 rounded border border-[#2d2d2d] bg-[#252526] text-[10px]">
                  <span className="text-[#858585] uppercase font-medium">
                    this
                  </span>
                  <span className="text-[#858585]">→</span>
                  <span
                    className={
                      typeof thisBinding === "number"
                        ? "text-[#e2b714] font-semibold"
                        : "text-[#d4d4d4]"
                    }
                  >
                    {thisDisplay}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-2 py-1 rounded border border-[#2d2d2d] bg-[#252526] text-[10px]">
                  <span className="text-[#858585] uppercase font-medium">
                    Outer
                  </span>
                  <span className="text-[#858585]">→</span>
                  <span className="text-[#d4d4d4]">{outerDisplay}</span>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </LazyMotion>
  );
}
