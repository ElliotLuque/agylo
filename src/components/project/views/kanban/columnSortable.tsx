import {
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import type { Column } from "../../../../types/kanban";
import { CSS } from "@dnd-kit/utilities";
import DotsHorizontalIcon from "../../../common/svg/dotsHorizontalIcon";
import AddIcon from "../../../common/svg/addIcon";

interface Props {
  id: Column["id"];
  index: Column["index"];
  name: Column["name"];
  tasksCount: number;
  children: React.ReactNode;
}

const ColumnSortable: React.FC<Props> = ({ id, name, children }) => {
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        className="flex h-full min-w-[20rem] flex-col gap-5 rounded-lg border-2 border-dashed border-gray-200 p-4 opacity-50 shadow"
        ref={setNodeRef}
        style={style}
      >
        <div className=" flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <h2 className="select-none text-xl font-bold">{name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button>
              <AddIcon classNames="w-4 h-4 text-gray-900" />
            </button>
            <button>
              <DotsHorizontalIcon classNames="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3 cursor-pointer">{children}</div>
      </div>
    );
  }

  return (
    <div
      className=" flex h-full min-w-[20rem] flex-col gap-5 rounded bg-white p-4"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className=" flex w-full cursor-grab items-center gap-4"
          {...attributes}
          {...listeners}
        >
          <h2 className="select-none text-xl font-bold">
            {name}-{id}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button>
            <AddIcon classNames="w-4 h-4 text-gray-900" />
          </button>
          <button>
            <DotsHorizontalIcon classNames="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

export default ColumnSortable;
