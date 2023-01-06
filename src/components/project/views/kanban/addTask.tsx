import { useRef, useState } from "react";
import type { Column, Task } from "../../../../types/kanban";
import { useOnClickOutside } from "usehooks-ts";
import { useKeypress } from "../../../../utils/useKeypress";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import { PlusIcon } from "@heroicons/react/24/outline";

const AddTask: React.FC<{ createTaskCallback: (column: Column) => void, column: Column, projectId: number }> = ({ createTaskCallback, column, projectId }) => {
  const [isAdding, setIsAdding] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleOutsideClick = () => setIsAdding(false);
  const handleInsideClick = () => setIsAdding(true);

  useOnClickOutside(ref, handleOutsideClick, "mouseup");
  useKeypress("Escape", () => setIsAdding(false));

  const { register, handleSubmit } = useForm<{ title: string }>({})

  const trpcUtils = trpc.useContext();
  const { mutateAsync: createTask } = trpc.task.createTask.useMutation();

  const handleCreateTask = async (formData: { title: string }) => {
    try {
      const newTask = await createTask({
        title: formData.title.trim(),
        projectId,
        columnId: column.id,
        index: column.tasks.length,
      });

      if (!newTask) return;

      trpcUtils.task.invalidate();

      setIsAdding(false);

      const buildTask = {
        id: newTask.id,
        title: newTask.title,
        index: newTask.index,
        taskKey: newTask.taskKey,
      } as Task;

      column.tasks.push(buildTask);
      createTaskCallback(column);

    } catch (error) {
      console.log(error);
    }
  }

  return isAdding ? (
    <div
      ref={ref}
      className="flex min-h-[7rem] w-[17rem] flex-col gap-2 rounded-lg border-[0.09rem] border-gray-200 bg-white p-4"
    >
      <form onSubmit={handleSubmit(handleCreateTask)}>
        <input
          {...register("title", { required: true })}
          autoFocus
          type="text"
          className="h-[2rem] w-full rounded-lg p-2 focus:outline-none "
          placeholder="Write a task title..."
        />
      </form>
    </div>
  ) : (
    <button
      onClick={handleInsideClick}
      className="flex min-h-[2rem] w-[17rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg p-4  hover:bg-gray-50"
    >
      <div className="flex w-full items-center justify-center gap-3">
        <PlusIcon className="w-[1.2rem] h-[1.2rem] text-gray-900 opacity-70" />
        <p className="select-none text-sm font-medium text-gray-900 opacity-70">
          Add task
        </p>
      </div>
    </button>
  );
};

export default AddTask;
