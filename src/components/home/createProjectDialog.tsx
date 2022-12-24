import { Dialog, Transition } from "@headlessui/react";
import { trpc } from "../../utils/trpc";
import { Fragment } from "react";
import { useForm } from "react-hook-form";

type DialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface IProjectInputs {
  name: string;
  url: string;
  description?: string;
}

const CreateProjectDialog: React.FC<DialogProps> = ({ open, setOpen }) => {
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProjectInputs>({});

  const { mutateAsync: createProject } = trpc.project.createProject.useMutation(
    {
      onSuccess: () => {
        setOpen(false);
        utils.project.listUserProject.invalidate();
        reset();
      },
    }
  );

  const onSubmit = async (data: IProjectInputs) => {
    createProject({
      name: data.name,
      url: data.url,
      description: data.description,
    });
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="pb-5 text-2xl font-medium leading-6 text-gray-800"
                  >
                    New project
                  </Dialog.Title>

                  <p className="py-3">
                    Create a project to start collaborating with people,
                    creating tasks and managing work.
                  </p>

                  <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
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
                        htmlFor="name"
                        className="text-md mb-2 block font-medium text-gray-800 dark:text-white"
                      >
                        URL
                      </label>
                      <div
                        className={`flex w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-50 text-sm font-medium text-gray-900 ${
                          errors.url
                            ? "border-red-400 bg-red-50 focus-within:ring-red-200"
                            : "focus-within:border-indigo-400 focus-within:ring-indigo-200"
                        } focus-within:outline-none focus-within:ring-1`}
                      >
                        <span className="border-r border-gray-300 bg-gray-100 p-2.5">
                          agylo.app/
                        </span>
                        <input
                          {...register("url", {
                            required: { value: true, message: "is required" },
                            pattern: {
                              value: /^[a-zA-Z0-9-]+$/,
                              message:
                                "can only contain letters, numbers and dashes",
                            },
                          })}
                          type="text"
                          id="url"
                          className={`w-full p-2.5 ${
                            errors.url
                              ? "border-red-400 bg-red-50 focus:ring-red-200"
                              : "focus:border-indigo-400 focus:ring-indigo-200"
                          } focus:outline-none focus:ring-1`}
                        />
                      </div>
                      {errors.url && (
                        <p className="mt-2 text-sm font-medium text-red-400">
                          Project URL {String(errors.url.message)}
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
                          Project description{" "}
                          {String(errors.description.message)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <button
                        onClick={() => {
                          setOpen(false);
                          reset();
                        }}
                        type="button"
                        className="w-full rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CreateProjectDialog;
