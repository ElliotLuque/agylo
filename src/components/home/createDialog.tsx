import { Dialog, Transition } from "@headlessui/react";
import { trpc } from "../../utils/trpc";
import { Fragment } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type DialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface IBoardInputs {
  name: string;
  description?: string;
}

const boardSchema = z.object({
  name: z.string().min(5),
  description: z.string().optional(),
});

const BoardCreateDialog: React.FC<DialogProps> = ({ open, setOpen }) => {
  const utils = trpc.useContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IBoardInputs>({
    resolver: zodResolver(boardSchema),
  });

  const { mutateAsync } = trpc.board.createBoard.useMutation({
    onSuccess: () => {
      setOpen(false);
      utils.board.listUserBoards.invalidate();
      reset();
    },
  });

  const onSubmit = async (data: IBoardInputs) => {
    mutateAsync({
      name: data.name,
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                    Create board
                  </Dialog.Title>

                  <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                      <label
                        htmlFor="name"
                        className="text-md mb-2 block font-medium text-gray-800 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        {...register("name")}
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
                          Board name must have at least 5 characters{" "}
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
                        {...register("description")}
                        id="description"
                        rows={5}
                        className="block w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Write your board description..."
                      />
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

export default BoardCreateDialog;
