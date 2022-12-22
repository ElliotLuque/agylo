import { useSortable } from "@dnd-kit/sortable";

const ColumnDraggable: React.FC<{ id: number; name: string }> = ({ id, name }) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="rounded p-4"
    >
      {name}
    </div>
  );
};

export default ColumnDraggable;
