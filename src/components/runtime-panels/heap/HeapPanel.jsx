import { useSelector, useDispatch } from "react-redux";
import { selectCurrentSnapshot } from "../../../store/selectors";
import { setModalData } from "../../../store/visualizationSlice";
import HeapCategoryGroup from "./HeapCategoryGroup";

function formatAddress(addr) {
  return `0x${addr.toString(16).padStart(4, "0")}`;
}

export default function HeapPanel() {
  const dispatch = useDispatch();
  const currentSnapshot = useSelector(selectCurrentSnapshot);

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

    dispatch(setModalData({
      type: "Heap Object",
      title: `${formatAddress(address)} [${meta?.typeTag || "Object"}]`,
      data: { address, value, meta },
    }));
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
            <HeapCategoryGroup
              name="Objects"
              entries={categories.Objects || []}
              onInspect={handleInspect}
            />
            <HeapCategoryGroup
              name="Functions"
              entries={categories.Functions || []}
              onInspect={handleInspect}
            />
            <HeapCategoryGroup
              name="Arrays"
              entries={categories.Arrays || []}
              onInspect={handleInspect}
            />
            <HeapCategoryGroup
              name="Promises"
              entries={categories.Promises || []}
              onInspect={handleInspect}
            />
            {categories.ClosureContexts?.length > 0 && (
              <HeapCategoryGroup
                name="Closure Contexts"
                entries={categories.ClosureContexts}
                onInspect={handleInspect}
              />
            )}
            {(categories.Maps?.length > 0 || categories.Sets?.length > 0) && (
              <HeapCategoryGroup
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
