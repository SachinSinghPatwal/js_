import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectModalData } from "../../../store/selectors";
import { setModalData } from "../../../store/visualizationSlice";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import ObjectInspectorTree from "./ObjectInspectorTree";

export default function EntityDetailsModal() {
  const dispatch = useDispatch();
  const modalData = useSelector(selectModalData);

  useEffect(() => {
    if (!modalData) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        dispatch(setModalData(null));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalData, dispatch]);

  if (!modalData) return null;

  const { type, title, data } = modalData;

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        <m.div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => dispatch(setModalData(null))}
        >
          <m.div 
            className="bg-[#252526] border border-[#2d2d2d] rounded-xl shadow-2xl w-[540px] max-w-[95vw] max-h-[80vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d2d2d] bg-[#1e1e1e]">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[9px] uppercase tracking-wider text-[#e2b714] bg-[#252526] border border-[#2d2d2d] px-1.5 py-0.5 rounded font-bold">
                  {type}
                </span>
                <h3 className="text-xs font-semibold text-[#d4d4d4]">
                  {title}
                </h3>
              </div>
              <button 
                type="button"
                className="text-[#858585] hover:text-[#d4d4d4] transition-colors text-sm px-1.5 py-0.5 cursor-pointer"
                onClick={() => dispatch(setModalData(null))}
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] text-[#d4d4d4] custom-scrollbar bg-[#252526]">
              {data && typeof data === "object" && !data.props ? (
                <ObjectInspectorTree data={data} />
              ) : (
                data
              )}
            </div>

            <div className="px-4 py-2 border-t border-[#2d2d2d] bg-[#1e1e1e] flex items-center justify-between text-[10px] font-mono text-[#858585]">
              <span>Inspector View</span>
              <span>Esc / Click outside to close</span>
            </div>
          </m.div>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}
