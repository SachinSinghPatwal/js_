import { useSelector, useDispatch } from "react-redux";
import { selectCurrentSnapshot } from "../../../store/selectors";
import { setModalData } from "../../../store/visualizationSlice";
import { AnimatePresence } from "framer-motion";
import QueueTaskCard from "./QueueTaskCard";

export default function MicroQueuePanel() {
  const dispatch = useDispatch();
  const currentSnapshot = useSelector(selectCurrentSnapshot);

  const microtasks = currentSnapshot?.runtime?.microtaskQueue || [];

  const handleInspect = (task) => {
    dispatch(setModalData({
      type: "Microtask Job",
      title: task.type || "Job",
      data: {
        type: task.type,
        callbackName: task.callback?.name || task.callback?.node?.id?.name || "(anonymous)",
        args: task.args,
      },
    }));
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="px-3 py-1.5 border-b border-[#252526] bg-[#252526] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#d4d4d4] uppercase tracking-wider font-semibold">
          Microtask Queue
        </span>
        <span className="text-[10px] font-mono text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1.5 py-0.5 rounded font-bold">
          {microtasks.length} {microtasks.length === 1 ? "Job" : "Jobs"}
        </span>
      </div>
      <div className="flex-1 p-2 overflow-x-auto flex items-start gap-1.5 custom-scrollbar min-h-[50px] font-mono">
        {microtasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full">
            <span className="text-[10px] text-[#858585] italic">
              Empty Queue
            </span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {microtasks.map((task, index) => {
              const callbackName =
                task.callback?.name ||
                task.callback?.node?.id?.name ||
                "callback";

              return (
                <QueueTaskCard
                  key={`micro-${index}`}
                  idKey={`micro-${index}`}
                  typeLabel={task.type || "Job"}
                  callbackName={callbackName}
                  onClick={() => handleInspect(task)}
                />
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
