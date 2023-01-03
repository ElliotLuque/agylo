import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../../../types/kanban";

const TaskSortable: React.FC<Task> = ({ id, title, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        {...attributes}
        {...listeners}
        ref={setNodeRef}
        style={style}
        className="rounded-lg min-h-[7rem] bg-gray-50 border-[0.115rem] border-dashed border-gray-300"
      >

      </div>
    );
  }
  
  return (
    <div
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-2 rounded-lg bg-white min-h-[7rem] min-w-[8rem] border-[0.09rem] border-gray-200 p-4"
    >
      <p>
        {id}-{title} at index {index}
      </p>
    </div>
  );
};

export default TaskSortable;
