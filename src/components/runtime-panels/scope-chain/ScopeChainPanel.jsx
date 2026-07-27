import { useSyncExternalStore } from "react";
import { VisualizationStore } from "../../../visualization/store/VisualizationStore";
import { Search } from "lucide-react";
import ScopeLevelCard from "./ScopeLevelCard";

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
  const maxDepth = 10;

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
          <ScopeLevelCard
            key={index}
            scope={scope}
            index={index}
            isLast={index === scopeChain.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
