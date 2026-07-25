import { useSyncExternalStore, useState } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  FunctionSquare,
  Layers,
  Timer,
  ChevronDown,
  ChevronRight,
  Link2,
} from "lucide-react";

const TYPE_COLORS = {
  Object: { border: "border-cyan-700/40", bg: "bg-cyan-950/30", text: "text-cyan-400", badge: "bg-cyan-900/50 text-cyan-300" },
  Function: { border: "border-fuchsia-700/40", bg: "bg-fuchsia-950/30", text: "text-fuchsia-400", badge: "bg-fuchsia-900/50 text-fuchsia-300" },
  Array: { border: "border-sky-700/40", bg: "bg-sky-950/30", text: "text-sky-400", badge: "bg-sky-900/50 text-sky-300" },
  Promise: { border: "border-violet-700/40", bg: "bg-violet-950/30", text: "text-violet-400", badge: "bg-violet-900/50 text-violet-300" },
  Map: { border: "border-emerald-700/40", bg: "bg-emerald-950/30", text: "text-emerald-400", badge: "bg-emerald-900/50 text-emerald-300" },
  Set: { border: "border-emerald-700/40", bg: "bg-emerald-950/30", text: "text-emerald-400", badge: "bg-emerald-900/50 text-emerald-300" },
  ClosureContext: { border: "border-pink-700/40", bg: "bg-pink-950/30", text: "text-pink-400", badge: "bg-pink-900/50 text-pink-300" },
  WeakMap: { border: "border-teal-700/40", bg: "bg-teal-950/30", text: "text-teal-400", badge: "bg-teal-900/50 text-teal-300" },
  WeakSet: { border: "border-teal-700/40", bg: "bg-teal-950/30", text: "text-teal-400", badge: "bg-teal-900/50 text-teal-300" },
};

const PROMISE_STATE_COLORS = {
  pending: "text-yellow-400 bg-yellow-900/30",
  fulfilled: "text-green-400 bg-green-900/30",
  rejected: "text-red-400 bg-red-900/30",
};

function formatAddress(addr) {
  return `0x${addr.toString(16).padStart(4, "0")}`;
}

function HeapObjectPreview({ value, typeTag }) {
  if (!value || typeof value !== "object") {
    return <span className="text-neutral-400 text-[10px]">{String(value)}</span>;
  }

  // Promise
  if (typeTag === "Promise" || value.PromiseState) {
    const stateColor = PROMISE_STATE_COLORS[value.PromiseState] || "text-neutral-400";
    return (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-neutral-500">State:</span>
          <span className={`text-[9px] font-mono px-1 rounded ${stateColor}`}>
            {value.PromiseState}
          </span>
        </div>
        {value.PromiseResult !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-neutral-500">Result:</span>
            <span className="text-[9px] font-mono text-neutral-300">
              {typeof value.PromiseResult === "number"
                ? `→ ${formatAddress(value.PromiseResult)}`
                : String(value.PromiseResult)}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Function
  if (typeTag === "Function" || value.type === "FunctionObject" || value.isNative) {
    const fnName = value.name || value.node?.id?.name || "(anonymous)";
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-mono text-fuchsia-300">
          ƒ {fnName}
        </span>
        {value.capturedEnvironment && (
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-pink-500/80">[[Environment]]</span>
            <span className="text-[8px] text-pink-400">→ Lexical Env</span>
          </div>
        )}
        {value.isArrow && (
          <span className="text-[8px] text-neutral-500 italic">arrow function</span>
        )}
      </div>
    );
  }

  // Array
  if (Array.isArray(value)) {
    return (
      <span className="text-[10px] font-mono text-sky-300">
        [{value.length} items]
      </span>
    );
  }

  // Regular object
  const keys = Object.keys(value).filter(
    (k) =>
      k !== "__proto__" &&
      k !== "PromiseFulfillReactions" &&
      k !== "PromiseRejectReactions",
  );
  if (keys.length === 0) {
    return <span className="text-[10px] font-mono text-neutral-400">{"{}"}</span>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      {keys.slice(0, 4).map((key) => {
        const val = value[key];
        const displayVal =
          typeof val === "number"
            ? `→ ${formatAddress(val)}`
            : typeof val === "object" && val !== null
              ? Array.isArray(val)
                ? `[${val.length}]`
                : "{...}"
              : val === undefined
                ? "undefined"
                : String(val);

        return (
          <div key={key} className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-cyan-500">{key}</span>
            <span className="text-[9px] text-neutral-600">:</span>
            <span className="text-[9px] font-mono text-neutral-300">
              {displayVal}
            </span>
          </div>
        );
      })}
      {keys.length > 4 && (
        <span className="text-[8px] text-neutral-500 italic">
          +{keys.length - 4} more
        </span>
      )}
    </div>
  );
}

function HeapEntry({ entry, onInspect }) {
  const [expanded, setExpanded] = useState(false);
  const colors = TYPE_COLORS[entry.typeTag] || TYPE_COLORS.Object;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`rounded border ${colors.border} ${colors.bg} overflow-hidden ${
        !entry.reachable ? "opacity-40 border-dashed" : ""
      }`}
    >
      <div
        className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-white/[0.03] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-1.5">
          {expanded ? (
            <ChevronDown size={10} className="text-neutral-500" />
          ) : (
            <ChevronRight size={10} className="text-neutral-500" />
          )}
          <span className="text-[9px] font-mono text-neutral-500">
            {formatAddress(entry.address)}
          </span>
          <span className={`text-[8px] font-mono px-1 rounded ${colors.badge}`}>
            {entry.typeTag}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {entry.references?.length > 0 && (
            <span className="text-[8px] text-neutral-500 flex items-center gap-0.5">
              <Link2 size={8} />
              {entry.references.length}
            </span>
          )}
          {!entry.reachable && (
            <span className="text-[8px] text-rose-400 bg-rose-950/50 px-1 rounded">
              GC
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-1.5 pt-0.5 border-t border-white/[0.05]">
              <HeapObjectPreview value={entry.value} typeTag={entry.typeTag} />

              {entry.references?.length > 0 && (
                <div className="mt-1 pt-1 border-t border-white/[0.05]">
                  <span className="text-[8px] font-mono text-neutral-500 uppercase">
                    References:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {entry.references.map((ref) => (
                      <span
                        key={ref}
                        className="text-[8px] font-mono text-cyan-400 bg-cyan-950/40 px-1 rounded cursor-pointer hover:bg-cyan-900/40 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspect?.(ref);
                        }}
                      >
                        → {formatAddress(ref)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function HeapCategory({ name, entries, icon: Icon, onInspect }) {
  const [collapsed, setCollapsed] = useState(false);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-1.5 cursor-pointer hover:text-neutral-300 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight size={10} className="text-neutral-500" />
        ) : (
          <ChevronDown size={10} className="text-neutral-500" />
        )}
        {Icon && <Icon size={10} className="text-neutral-500" />}
        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
          {name}
        </span>
        <span className="text-[8px] font-mono text-neutral-600">
          ({entries.length})
        </span>
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col gap-1 pl-2 overflow-hidden"
          >
            {entries.map((entry) => (
              <HeapEntry
                key={entry.address}
                entry={entry}
                onInspect={onInspect}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HeapPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  // Use the pre-computed categorized heap from the snapshot
  const heapCategorized = currentSnapshot?.heapCategorized;

  // Fallback: compute from the raw heap if categorized view isn't available
  let categories = heapCategorized;
  if (!categories) {
    const heap = currentSnapshot?.runtime?.heap;
    if (heap && typeof heap.getAllCategorized === "function") {
      try {
        categories = heap.getAllCategorized();
      } catch {
        categories = null;
      }
    }
  }

  const totalObjects = categories
    ? Object.values(categories).reduce((sum, arr) => sum + (arr?.length || 0), 0)
    : 0;

  const handleInspect = (address) => {
    const heap = currentSnapshot?.runtime?.heap;
    if (!heap) return;
    const value = heap.get?.(address);
    const meta = heap.getMeta?.(address);

    VisualizationStore.setModalData({
      type: "Heap Object",
      title: `${formatAddress(address)} [${meta?.typeTag || "Object"}]`,
      data: { address, value, meta },
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#0d0d0d]">
      <div className="px-3 py-1.5 border-b border-[#222] bg-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500/60" />
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            Memory Heap
          </span>
        </div>
        <span className="text-[10px] font-mono bg-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded">
          {totalObjects} Objects
        </span>
      </div>
      <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2">
        {!categories || totalObjects === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-xs font-mono text-neutral-600 italic text-center">
              <div className="text-neutral-500 mb-1">📦</div>
              Heap Empty
            </div>
          </div>
        ) : (
          <>
            <HeapCategory
              name="Objects"
              entries={categories.Objects || []}
              icon={Box}
              onInspect={handleInspect}
            />
            <HeapCategory
              name="Functions"
              entries={categories.Functions || []}
              icon={FunctionSquare}
              onInspect={handleInspect}
            />
            <HeapCategory
              name="Arrays"
              entries={categories.Arrays || []}
              icon={Layers}
              onInspect={handleInspect}
            />
            <HeapCategory
              name="Promises"
              entries={categories.Promises || []}
              icon={Timer}
              onInspect={handleInspect}
            />
            {(categories.ClosureContexts?.length > 0) && (
              <HeapCategory
                name="Closure Contexts"
                entries={categories.ClosureContexts}
                icon={Link2}
                onInspect={handleInspect}
              />
            )}
            {(categories.Maps?.length > 0 || categories.Sets?.length > 0) && (
              <HeapCategory
                name="Maps & Sets"
                entries={[...(categories.Maps || []), ...(categories.Sets || [])]}
                icon={Layers}
                onInspect={handleInspect}
              />
            )}
            {(categories.WeakMaps?.length > 0 || categories.WeakSets?.length > 0) && (
              <HeapCategory
                name="Weak Collections"
                entries={[
                  ...(categories.WeakMaps || []),
                  ...(categories.WeakSets || []),
                ]}
                icon={Layers}
                onInspect={handleInspect}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
