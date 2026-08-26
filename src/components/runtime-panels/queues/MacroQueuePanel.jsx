import { useSelector, useDispatch } from "react-redux";
import { selectCurrentSnapshot } from "../../../store/selectors";
import { setModalData } from "../../../store/visualizationSlice";
import { AnimatePresence } from "framer-motion";
import QueueTaskCard from "./QueueTaskCard";

export default function MacroQueuePanel() {
  const dispatch = useDispatch();
  const currentSnapshot = useSelector(selectCurrentSnapshot);

  const macrotasks = currentSnapshot?.runtime?.macrotaskQueue || [];

  const handleInspect = (task) => {
    dispatch(setModalData({
      type: "Macrotask",
      title: task.type || "Task",
      data: {
        type: task.type,
        callbackName: task.callback?.name || task.callback?.node?.id?.name || "(anonymous)",
        args: task.args,
        timerId: task.timerId,
      },
    }));
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
      <div className="px-3 py-1.5 border-b border-[#252526] bg-[#252526] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#d4d4d4] uppercase tracking-wider font-semibold">
          Macrotask Queue
        </span>
        <span className="text-[10px] font-mono text-[#e2b714] bg-[#1e1e1e] border border-[#2d2d2d] px-1.5 py-0.5 rounded font-bold">
          {macrotasks.length} {macrotasks.length === 1 ? "Task" : "Tasks"}
        </span>
      </div>
      <div className="flex-1 p-2 overflow-x-auto flex items-start gap-1.5 custom-scrollbar min-h-[50px] font-mono">
        {macrotasks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center w-full">
            <span className="text-[10px] text-[#858585] italic">
              Empty Queue
            </span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {macrotasks.map((task, index) => {
              const callbackName =
                task.callback?.name ||
                task.callback?.node?.id?.name ||
                "callback";

              return (
                <QueueTaskCard
                  key={`macro-${index}`}
                  idKey={`macro-${index}`}
                  typeLabel={task.type || "Task"}
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
