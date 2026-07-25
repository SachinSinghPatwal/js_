import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion } from "framer-motion";
import { ArrowDown, Search } from "lucide-react";

export default function ScopeChainPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const callStack =
    currentSnapshot?.runtime?.executionContextStack?.stack || [];
  const currentFrame = callStack[callStack.length - 1];

  if (!currentFrame) {
    return (
      <div className="h-full w-full flex flex-col bg-[#0d0d0d]">
        <div className="px-3 py-1.5 border-b border-[#222] bg-[#141414] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500/60" />
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Scope Chain
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[10px] font-mono text-neutral-600 italic">
            No active scope
          </span>
        </div>
      </div>
    );
  }

  // Build scope chain by following outer references
  const scopeChain = [];
  let env = currentFrame.lexicalEnvironment;
  let depth = 0;
  const maxDepth = 10; // Safety limit

  while (env && depth < maxDepth) {
    const bindings = env.environmentRecord?.bindings;
    const bindingNames = bindings ? Array.from(bindings.keys()) : [];
    const scopeName = env.scope?.name || (depth === 0 ? "Current" : "Outer");
    const isGlobal = !env.outer;

    scopeChain.push({
      name: isGlobal ? "Global Scope" : `${scopeName} Scope`,
      bindings: bindingNames,
      isGlobal,
      depth,
    });

    env = env.outer;
    depth++;
  }

  return (
    <div className="h-full w-full flex flex-col bg-[#0d0d0d]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-500/60" />
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Scope Chain
          </span>
        </div>
        <span className="text-[10px] font-mono bg-violet-900/30 text-violet-400 px-1.5 py-0.5 rounded">
          {scopeChain.length} {scopeChain.length === 1 ? "Level" : "Levels"}
        </span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto flex flex-col items-center gap-0">
        {/* Identifier lookup animation hint */}
        <div className="mb-2 flex items-center gap-1.5 px-2 py-1 rounded bg-violet-950/20 border border-violet-900/20">
          <Search size={10} className="text-violet-500/70" />
          <span className="text-[9px] font-mono text-violet-400/70">
            Identifier Lookup: Current → Outer → ... → Global
          </span>
        </div>

        {scopeChain.map((scope, index) => (
          <div key={index} className="flex flex-col items-center w-full">
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

            {/* Arrow between scopes */}
            {index < scopeChain.length - 1 && (
              <div className="py-0.5">
                <ArrowDown size={12} className="text-violet-700/50" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
