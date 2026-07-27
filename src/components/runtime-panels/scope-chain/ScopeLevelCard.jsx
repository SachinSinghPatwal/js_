import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function ScopeLevelCard({ scope, index, isLast }) {
  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`w-full max-w-[220px] rounded-lg border px-3 py-2 ${
          index === 0
            ? "border-violet-500/50 bg-violet-950/40"
            : scope.isGlobal
              ? "border-amber-700/40 bg-amber-950/20"
              : "border-violet-800/30 bg-violet-950/20"
        }`}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-[10px] font-mono font-semibold ${
              index === 0
                ? "text-violet-300"
                : scope.isGlobal
                  ? "text-amber-400"
                  : "text-violet-400/70"
            }`}
          >
            {scope.name}
          </span>
          {index === 0 && (
            <span className="text-[8px] text-violet-400 animate-pulse">
              Current
            </span>
          )}
        </div>
        {scope.bindings.length > 0 ? (
          <div className="flex flex-wrap gap-0.5">
            {scope.bindings.slice(0, 6).map((name) => (
              <span
                key={name}
                className="text-[8px] font-mono text-neutral-400 bg-neutral-900/50 px-1 rounded"
              >
                {name}
              </span>
            ))}
            {scope.bindings.length > 6 && (
              <span className="text-[8px] text-neutral-500 italic">
                +{scope.bindings.length - 6}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[8px] text-neutral-600 italic">
            No bindings
          </span>
        )}
      </motion.div>

      {!isLast && (
        <div className="py-0.5">
          <ArrowDown size={12} className="text-violet-700/50" />
        </div>
      )}
    </div>
  );
}
