import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { trpc } from "../../../../../utils/trpc";

interface IProjectUpdateInputs {
  name: string;
  description: string;
}

const SettingsSection: React.FC<{
  id: number;
  name: string;
  description: string;
  setToast: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ id, name, description, setToast }) => {
  const trpcUtils = trpc.useContext();

  const { mutateAsync: updateProject } = trpc.project.updateProject.useMutation(
    {
      onSuccess: () => {
        setToast(true);
        trpcUtils.project.invalidate();
        setTimeout(() => {
          setToast(false);
        }, 3500);
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProjectUpdateInputs>({});

  const onSubmit = async (data: IProjectUpdateInputs) => {
    updateProject({
      id,
      name: data.name,
      description: data.description,
    });
  };

  useEffect(() => {
    reset({
      name,
      description,
    });
  }, [name, description, reset]);

  return (
    <div className="py-5">
      <h1 className="text-lg font-medium text-gray-800">Details</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-6">
          <label
            htmlFor="name"
            className="text-md mb-2 block font-medium text-gray-800 dark:text-white"
          >
            Name
          </label>
          <input
            {...register("name", {
              required: { value: true, message: "is required" },
              minLength: {
                value: 5,
                message: "must have at least 5 characters",
              },
              maxLength: {
                value: 20,
                message: "must have a maximum of 20 characters",
              },
            })}
            type="text"
            id="name"
            className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm font-medium text-gray-900 ${
              errors.name
                ? "border-red-400 bg-red-50 focus:ring-red-200"
                : "focus:border-indigo-400 focus:ring-indigo-200"
            } focus:outline-none focus:ring-1`}
          />
          {errors.name && (
            <p className="mt-2 text-sm font-medium text-red-400">
              Project name {String(errors.name.message)}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="text-md mb-2 block font-medium text-gray-800 dark:text-white"
          >
            Description
          </label>
          <textarea
            {...register("description", {
              maxLength: {
                value: 200,
                message: "must have a maximum of 200 characters",
              },
            })}
            id="description"
            rows={5}
            className={`block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 ${
              errors.description
                ? "border-red-400 bg-red-50 focus:ring-red-200"
                : "focus:border-indigo-400 focus:ring-indigo-200"
            }  focus:outline-none focus:ring-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
            placeholder="Write your project description..."
          />
          {errors.description && (
            <p className="mt-2 text-sm font-medium text-red-400">
              Project description {String(errors.description.message)}
            </p>
          )}
        </div>
        <div className="flex flex-row items-center justify-between">
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsSection;
