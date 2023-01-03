import { useSortable } from "@dnd-kit/sortable";
import type { Column } from "../../../../types/kanban";
import { CSS } from "@dnd-kit/utilities";
import HandleIcon from "../../../common/svg/handleIcon";

interface Props {
  id: Column["id"];
  index: Column["index"];
  name: Column["name"];
  tasksCount: number;
  children: React.ReactNode;
}

const ColumnSortable: React.FC<Props> = ({
  id,
  index,
  name,
  tasksCount,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      className="flex min-w-[20rem] flex-col gap-5 rounded-lg p-4"
      ref={setNodeRef}
      style={style}
    >
      <div className=" group flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold">
            {name} 
          </h2>
          <span className="group-hover:visible invisible" {...attributes} {...listeners}>
            <HandleIcon />
          </span>
        </div>
        <p className="text-xs">
          {tasksCount > 1 ? `${tasksCount} tasks` : `${tasksCount} task`}
          {" "} - {index}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {children}
      </div>
    </div>
  );
};

export default ColumnSortable;
