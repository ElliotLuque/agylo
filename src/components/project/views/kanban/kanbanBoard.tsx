import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  closestCorners,
  DragOverlay,
  defaultDropAnimation,
  TouchSensor,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import type { Assignee, Column, Label } from "../../../../types/kanban";
import ColumnSortable from "./columnSortable";
import TaskSortable from "./taskSortable";
import { createPortal } from "react-dom";

interface KanbanProps {
  columns: Column[];
}

const KanbanBoard: React.FC<KanbanProps> = ({ columns: projectColumns }) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier>();

  const [columns, setColumns] = useState<Column[]>(projectColumns);
  const columnsIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );
  const taskIds = (column: Column) => {
    return column.tasks.map((task) => task.id);
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    setActiveId(active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    const activeId = active?.id;
    const overId = over?.id as UniqueIdentifier;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      isColumnId(activeId) ||
      activeContainer === undefined ||
      overContainer === undefined ||
      activeContainer === overContainer
    ) {
      return;
    }

    setColumns((prev) => {
      const newActiveContainer = {
        ...activeContainer,
        tasks: activeContainer.tasks.filter((task) => task.id !== activeId),
      };

      const orderedNewActiveContainer = {
        ...newActiveContainer,
        tasks: newActiveContainer.tasks.map((task, index) => {
          return {
            ...task,
            index,
          };
        }),
      };

      const newOverContainer = {
        ...overContainer,
        tasks: [
          ...overContainer.tasks,
          activeContainer.tasks.find((task) => task.id === activeId),
        ],
      };

      const orderedNewOverContainer = {
        ...newOverContainer,
        tasks: newOverContainer.tasks.map((task, index) => {
          return {
            ...task,
            index,
          };
        }),
      };

      const newColumns = prev.map((col) => {
        if (col.id === orderedNewActiveContainer.id) {
          return orderedNewActiveContainer;
        }
        if (col.id === orderedNewOverContainer.id) {
          return orderedNewOverContainer;
        }
        return col;
      });

      return newColumns as Column[];
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const activeId = active?.id;
    const overId = over?.id as UniqueIdentifier;

    // Only for task sorting inside a column
    if (
      findContainer(activeId) === findContainer(overId) &&
      !isColumnId(overId) &&
      !isColumnId(activeId)
    ) {
      setColumns((prev) => {
        const activeContainer = findContainer(activeId);
        const activeItemIndex = activeContainer?.tasks.findIndex((item) => {
          return item.id === active.id;
        });

        const overItemIndex = activeContainer?.tasks.findIndex((item) => {
          return item.id === over?.id;
        });

        if (
          activeItemIndex === undefined ||
          overItemIndex === undefined ||
          activeContainer === undefined
        )
          return prev;

        const newTasks = arrayMove(
          activeContainer.tasks,
          activeItemIndex,
          overItemIndex
        );
        const orderedTasks = newTasks.map((task, index) => {
          return {
            ...task,
            index: index,
          };
        });

        const updatedColumn = {
          ...activeContainer,
          tasks: orderedTasks,
        };

        const newColumns = prev.map((col) => {
          return col.id === activeContainer.id ? updatedColumn : col;
        });

        return newColumns;
      });
    }

    // Only for columns sorting
    if (isColumnId(activeId)) {
      setColumns((prev) => {
        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (activeContainer === undefined || overContainer === undefined)
          return prev;

        const activeContainerIndex = getColumnIndex(activeContainer.id);
        const overContainerIndex = getColumnIndex(overContainer.id);

        const updatedColumns = arrayMove(
          prev,
          activeContainerIndex,
          overContainerIndex
        );
        const orderedColumns = updatedColumns.map((column, index) => {
          return {
            ...column,
            index: index,
          };
        });

        return orderedColumns;
      });
    }

    setActiveId(undefined);
  };

  const handleDragCancel = () => {
    setActiveId(undefined);
  };

  const findContainer = (id: UniqueIdentifier) => {
    const preResult = columns.find((col) => {
      return col.tasks.find((task) => {
        return task.id === id;
      });
    });

    if (preResult) {
      return preResult;
    } else {
      return columns.find((col) => {
        return col.id === id;
      });
    }
  };

  const isColumnId = (id: UniqueIdentifier) => {
    const result = columns.find((col) => {
      return col.id === id;
    });
    return result ? true : false;
  };

  const getColumnIndex = (id: UniqueIdentifier) => {
    const column = findContainer(id) as Column;
    return columns.indexOf(column);
  };

  const renderColumnDragOverlay = (id: UniqueIdentifier) => {
    const column = columns[getColumnIndex(id)];
    return (
      <ColumnSortable
        key={column?.id}
        id={column?.id as number}
        name={column?.name as string}
        index={column?.index as number}
        tasksCount={column?.tasks.length as number}
      >
        {column?.tasks.map((task) => (
          <TaskSortable
            key={task.id}
            id={task.id}
            title={task.title}
            index={task.index}
            assignee={task.assignee}
            priorityId={task.priorityId}
            labels={task.labels}
            commentCount={task.commentCount}
            attachmentCount={task.attachmentCount}
          />
        ))}
      </ColumnSortable>
    );
  };

  const renderTaskDragOverlay = (id: UniqueIdentifier) => {
    const columnParent = columns.find((col) => {
      return col.tasks.find((tsk) => {
        return tsk.id === id;
      });
    });
    const taskIndex = columnParent?.tasks.findIndex((tsk) => {
      return tsk.id === id;
    });
    const task = columnParent?.tasks[taskIndex as number];

    return (
      <TaskSortable
        key={task?.id as number}
        id={task?.id as number}
        title={task?.title as string}
        index={task?.index as number}
        assignee={task?.assignee as Assignee}
        priorityId={task?.priorityId as number}
        labels={task?.labels as Label[]}
        commentCount={task?.commentCount as number}
        attachmentCount={task?.attachmentCount as number}
      />
    );
  };

  if (columns.length <= 0) return <div>No columns</div>;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCorners}
    >
      <SortableContext
        items={columnsIds}
        strategy={horizontalListSortingStrategy}
      >
        {columns.map((column) => {
          return (
            <ColumnSortable
              key={column.id}
              id={column.id}
              index={column.index}
              name={column.name}
              tasksCount={column.tasks.length}
            >
              <SortableContext
                items={taskIds(column)}
                strategy={verticalListSortingStrategy}
              >
                {column.tasks.map((task) => {
                  return (
                    <TaskSortable
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      index={task.index}
                      assignee={task.assignee}
                      priorityId={task.priorityId}
                      labels={task.labels}
                      commentCount={task.commentCount}
                      attachmentCount={task.attachmentCount}
                    />
                  );
                })}
              </SortableContext>
            </ColumnSortable>
          );
        })}
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {activeId
            ? columns.map((col) => col.id).includes(activeId as number)
              ? renderColumnDragOverlay(activeId)
              : renderTaskDragOverlay(activeId)
            : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default KanbanBoard;
