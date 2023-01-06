import Link from "next/link";
import { trpc } from "../../utils/trpc";
import HomeIcon from "./svg/homeIcon";
import TasksIcon from "./svg/tasksIcon";
import NotificationIcon from "./svg/notificationIcon";
import AddIcon from "./svg/addIcon";
import { useState } from "react";
import CreateProjectDialog from "../home/createProjectDialog";
import { getIconBg } from "../../utils/colorSetter";

const Navbar: React.FC = () => {
  return (
    <div className="mt-10 flex flex-col justify-center gap-6 text-lg font-semibold text-gray-800">
      <Link href="/dashboard">
        <div className="flex items-center gap-3">
          <HomeIcon />
          <h1>Home</h1>
        </div>
      </Link>
      <Link href="/my-tasks">
        <div className="flex items-center gap-3">
          <TasksIcon />
          <h1>My tasks</h1>
        </div>
      </Link>
      <div>
        <div className="flex cursor-default items-center gap-3">
          <NotificationIcon />
          <h1 className="opacity-40 ">
            Inbox <span className="text-sm">(Coming soon!)</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

const ProjectItem: React.FC<{ name: string; url: string; iconId: number }> = ({
  name,
  url,
  iconId,
}) => {
  return (
    <Link className="flex items-center gap-2 align-middle" href={`/${url}`}>
      <span className={`mr-3 h-3 w-3 rounded-sm ${getIconBg(iconId)}`}></span>
      <p className="text-md font-bold text-gray-800">{name}</p>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { data: userProjects } = trpc.project.listUserProjects.useQuery();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  return (
    <>
      <CreateProjectDialog
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
      />

      <aside className="border-r-1 fixed top-0 z-10 h-screen w-72 border border-gray-200 bg-white">
        <div className="flex h-full flex-col gap-6 py-4 px-7">
          <h1 className="mt-5 text-2xl font-bold text-indigo-500"> Agylo</h1>
          <Navbar />
          <div className="mt-8">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-lg font-medium opacity-70">Projects</h1>
              <button onClick={() => setOpenCreateDialog(true)}>
                <AddIcon classNames="h-5 w-5" />
              </button>
            </div>
            <div className="h-76 ml-1.5 mt-5 mb-4 flex flex-col gap-3.5 overflow-auto">
              {userProjects?.map((project) => {
                return (
                  <ProjectItem
                    key={project.projectId}
                    name={project.project.name}
                    url={project.project.url}
                    iconId={project.project.iconId}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
