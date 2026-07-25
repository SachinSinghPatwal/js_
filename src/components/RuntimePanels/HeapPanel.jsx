import { useSyncExternalStore, useState } from "react";
import { VisualizationStore } from "../../visualization/store/VisualizationStore";
import { motion, AnimatePresence } from "framer-motion";

function formatAddress(addr) {
  return `0x${addr.toString(16).padStart(4, "0")}`;
}

function HeapObjectPreview({ value, typeTag }) {
  if (!value || typeof value !== "object") {
    return <span className="text-[#d4d4d4] text-[10px]">{String(value)}</span>;
  }

  if (typeTag === "Promise" || value.PromiseState) {
    return (
      <div className="flex flex-col gap-0.5 font-mono text-[9px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[#858585]">State:</span>
          <span className="text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1 rounded font-bold">
            {value.PromiseState}
          </span>
        </div>
        {value.PromiseResult !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="text-[#858585]">Result:</span>
            <span className="text-[#d4d4d4]">
              {typeof value.PromiseResult === "number"
                ? `→ ${formatAddress(value.PromiseResult)}`
                : String(value.PromiseResult)}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (typeTag === "Function" || value.type === "FunctionObject" || value.isNative) {
    const fnName = value.name || value.node?.id?.name || "(anonymous)";
    return (
      <div className="flex flex-col gap-0.5 font-mono text-[9px]">
        <span className="text-[#e2b714] font-medium">ƒ {fnName}</span>
        {value.capturedEnvironment && (
          <span className="text-[#858585]">[[Environment]] → Lexical Env</span>
        )}
      </div>
    );
  }

  if (Array.isArray(value)) {
    return (
      <span className="text-[10px] font-mono text-[#d4d4d4]">
        [{value.length} items]
      </span>
    );
  }

  const keys = Object.keys(value).filter(
    (k) =>
      k !== "__proto__" &&
      k !== "PromiseFulfillReactions" &&
      k !== "PromiseRejectReactions",
  );

  if (keys.length === 0) {
    return <span className="text-[10px] font-mono text-[#858585]">{"{}"}</span>;
  }

  return (
    <div className="flex flex-col gap-0.5 font-mono text-[9px]">
      {keys.slice(0, 4).map((key) => {
        const val = value[key];
        const displayVal =
          typeof val === "number"
            ? `→ ${formatAddress(val)}`
            : typeof val === "object" && val !== null
              ? Array.isArray(val)
                ? `[${val.length}]`
                : "{...}"
              : String(val);

        return (
          <div key={key} className="flex items-center gap-1">
            <span className="text-[#e2b714] font-medium">{key}</span>
            <span className="text-[#858585]">:</span>
            <span className="text-[#d4d4d4]">{displayVal}</span>
          </div>
        );
      })}
    </div>
  );
}

function HeapEntry({ entry, onInspect }) {
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

function HeapCategory({ name, entries, onInspect }) {
  const [collapsed, setCollapsed] = useState(false);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-1.5 cursor-pointer text-[#d4d4d4] hover:text-[#e2b714] transition-colors font-mono text-[9px]"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="text-[#858585]">{collapsed ? "▶" : "▼"}</span>
        <span className="uppercase tracking-wider font-semibold">{name}</span>
        <span className="text-[#858585]">({entries.length})</span>
      </div>
      {!collapsed && (
        <div className="flex flex-col gap-1 pl-2">
          {entries.map((entry) => (
            <HeapEntry
              key={entry.address}
              entry={entry}
              onInspect={onInspect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HeapPanel() {
  const { currentSnapshot } = useSyncExternalStore(
    (listener) => VisualizationStore.subscribe(listener),
    () => VisualizationStore.getSnapshot(),
  );

  const heapCategorized = currentSnapshot?.heapCategorized;

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
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="px-3 py-1.5 border-b border-[#252526] bg-[#252526] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#d4d4d4] uppercase tracking-wider font-semibold">
          Memory Heap
        </span>
        <span className="text-[10px] font-mono text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1.5 py-0.5 rounded font-bold">
          {totalObjects} Objects
        </span>
      </div>
      <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
        {!categories || totalObjects === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-xs font-mono text-[#858585] italic">
              Heap Empty
            </span>
          </div>
        ) : (
          <>
            <HeapCategory
              name="Objects"
              entries={categories.Objects || []}
              onInspect={handleInspect}
            />
            <HeapCategory
              name="Functions"
              entries={categories.Functions || []}
              onInspect={handleInspect}
            />
            <HeapCategory
              name="Arrays"
              entries={categories.Arrays || []}
              onInspect={handleInspect}
            />
            <HeapCategory
              name="Promises"
              entries={categories.Promises || []}
              onInspect={handleInspect}
            />
            {categories.ClosureContexts?.length > 0 && (
              <HeapCategory
                name="Closure Contexts"
                entries={categories.ClosureContexts}
                onInspect={handleInspect}
              />
            )}
            {(categories.Maps?.length > 0 || categories.Sets?.length > 0) && (
              <HeapCategory
                name="Maps & Sets"
                entries={[...(categories.Maps || []), ...(categories.Sets || [])]}
                onInspect={handleInspect}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
