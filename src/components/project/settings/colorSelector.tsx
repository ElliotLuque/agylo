import { Popover, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { motion } from "framer-motion";
import { getIconBg } from "../../../utils/colorSetter";

const ColorSelector: React.FC<{projectId: number}> = ({projectId}) => {
  const trpcUtils = trpc.useContext();
  const { data: colors } = trpc.colors.list.useQuery();
  const [selectedColor, setSelectedColor] = useState<number>(0);

  const { mutateAsync: updateIcon } = trpc.project.updateProjectIcon.useMutation();

  const handleSave = async () => {
    await updateIcon({ id: projectId ,iconId: selectedColor});
    trpcUtils.project.invalidate();
  };

  return (
    <Popover className="relative">
      <Popover.Button className="w-full rounded-lg bg-indigo-500 px-2.5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
        Change icon
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-10">
          <div className="flex w-48 flex-col gap-5 rounded-xl bg-white p-6 shadow-xl">
            <div className="flex flex-wrap gap-4">
              {colors?.map((color) => {
                return (
                  <motion.span
                    onClick={() => setSelectedColor(color.id)}
                    key={color.id}
                    className={`h-8 w-8 cursor-pointer rounded ${getIconBg(
                      color.id
                    )} ${
                      color.id === selectedColor ? "ring-4 ring-indigo-400" : ""
                    }`}
                    whileHover={{ scale: 1.3 }}
                  ></motion.span>
                );
              })}
            </div>
            <button onClick={handleSave} className="w-full rounded-lg bg-indigo-500 px-2.5 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
              Save
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default ColorSelector;
