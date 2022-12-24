import Link from "next/link";
import { trpc } from "../../utils/trpc";
import HomeIcon from "./svg/homeIcon";
import TasksIcon from "./svg/tasksIcon";
import NotificationIcon from "./svg/notificationIcon";
import AddIcon from "./svg/addIcon";
import { useState } from "react";
import CreateProjectDialog from "../home/createProjectDialog";

const Sidebar: React.FC = () => {
  const { data: userProjects } = trpc.project.listUserProject.useQuery();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  return (
    <aside className="border-r-1 fixed top-0 h-screen w-72 border border-gray-200 bg-white">
      <CreateProjectDialog open={openCreateDialog} setOpen={setOpenCreateDialog} />
      <div className="flex h-full flex-col gap-2 py-4 px-7">
        <h1 className="mt-5 text-xl font-bold text-indigo-500">Logo agylo</h1>
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
          <Link href="/inbox">
            <div className="flex items-center gap-3">
              <NotificationIcon />
              <h1>Inbox</h1>
            </div>
          </Link>
        </div>
        <div className="mt-8">
          <div className="flex w-full items-center justify-between group">
            <h1 className="text-lg font-medium text-stone-500">Projects</h1>
            <div className="invisible group-hover:visible" onClick={() => setOpenCreateDialog(true)}>
              <AddIcon />
            </div>
          </div>
          <div className="h-76 ml-1.5 mt-5 mb-4 flex flex-col gap-3.5 overflow-auto">
            {userProjects?.map((project) => (
              <Link
                className="text-sm font-bold text-gray-800"
                href={`/${project.projectId}`}
                key={project.projectId}
              >
                <div>
                  <p>{project.project.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
