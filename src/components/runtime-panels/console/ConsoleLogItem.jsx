import { LazyMotion, m, domAnimation } from "framer-motion";

export default function ConsoleLogItem({ log, index }) {
  const isError = log.type === "error";
  const isWarn = log.type === "warn";

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        key={index}
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`flex items-start justify-between gap-2 py-1 px-1.5 rounded border-b border-[#252526] last:border-b-0 ${
          isError
            ? "bg-[#2a1b1c] text-[#f44747]"
            : isWarn
              ? "bg-[#2a261b] text-[#cca712]"
              : ""
        }`}
      >
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <span className={`shrink-0 font-bold ${isError ? "text-[#f44747]" : "text-[#e2b714]"}`}>
            {isError ? "✖" : isWarn ? "⚠" : ">"}
          </span>
          <div className="flex flex-wrap gap-1.5 text-[#d4d4d4] truncate">
            {log.args?.map((arg, argIdx) => (
              <span key={argIdx} className="text-[#d4d4d4]">
                {typeof arg === "object" && arg !== null
                  ? `[${arg.type || "Object"}]`
                  : String(arg)}
              </span>
            ))}
          </div>
        </div>

        {log.line !== undefined && (
          <span className="text-[10px] text-[#858585] shrink-0 font-mono pl-2">
            Line {log.line}
          </span>
        )}
      </m.div>
    </LazyMotion>
  );
}
